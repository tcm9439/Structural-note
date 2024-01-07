import { Cloneable } from "@/common/Cloneable.js"
import { InvalidTypeConversionException, InvalidTypeConversionForDataException } from "@/exception/AttributeException.js"
import { ConstraintType, Constraint } from "../constraint/Constraint.js"
import { ConstraintTypeToClassMap } from "../constraint/ConstraintMap.js"
import { LoggerManager } from "@/common/Logger.js"
import { OperationResult } from "@/common/OperationResult.js"

export enum AttributeTypeEnum {
    STRING = "STRING",
    LONG_STRING = "LONG_STRING",
    BOOLEAN = "BOOLEAN",
    MARKDOWN = "MARKDOWN",
    INT = "INT",
    DECIMAL = "DECIMAL",
    ENUM = "ENUM",
}

export interface AttributeValueConverter<OriType,NewType> {
    (value: OriType, param?: object): NewType
}

/**
 * Singleton
 * Defines
 * - the type of the attribute
 * - the types it can be converted to
 * - the conversion functions
 */
export abstract class AttributeType<T> implements Cloneable<AttributeType<T>> {
    private static attrTypes: Map<string, AttributeType<any>> = new Map()
    private _type: string
    /**
     * Map of AttrType => { Map of ModeID => Converter }
     */
    private _converters: Map<string, AttributeValueConverter<T, any>> = new Map()
    private _available_constraints: ConstraintType[] = [
        ConstraintType.REQUIRE
    ]
    private _required_constraints: ConstraintType[] = []

    constructor(type: string) {
        this._type = type
        AttributeType.attrTypes.set(type, this)
    }

    abstract get default_value(): T

    static getAttrTypes(): AttributeType<any>[] {
        return Array.from(AttributeType.attrTypes.values())
    }

    static getAttrType(type: string): AttributeType<any> | undefined {
        return AttributeType.attrTypes.get(type)
    }

    get convertibleTo(): IterableIterator<string> {
        return this.converters.keys()
    }

    get type(): string {
        return this._type
    }

    getTypeTranslationKey(): string {
        return AttributeType.getAttrTypeByTranslationKey(this.type)
    }

    static getAttrTypeByTranslationKey(type: string): string {
        return `structural.attribute.type.${type}`
    }

    addAvailableConstraint(constraint_type: ConstraintType): void {
        this._available_constraints.push(constraint_type)
    }

    get available_constraints(): ConstraintType[] {
        return this._available_constraints
    }

    addRequiredConstraint(constraint_type: ConstraintType): void {
        this._required_constraints.push(constraint_type)
    }

    get required_constraints(): ConstraintType[] {
        return this._required_constraints
    }

    requiresConstraint(constraint: Constraint | ConstraintType): boolean {
        if (constraint instanceof Constraint) {
            return this.required_constraints.includes(constraint.getType())
        }
        return this.required_constraints.includes(constraint)
    }

    allowConstraint(constraint: Constraint | ConstraintType): boolean {
        if (constraint instanceof Constraint) {
            return this.available_constraints.includes(constraint.getType())
        }
        return this.available_constraints.includes(constraint)
    }

    private get converters(): Map<string, AttributeValueConverter<T, any>> {
        return this._converters
    }

    isConvertibleTo(type: string): boolean {
        return this.converters.has(type)
    }

    addConvertibleType(type: string, convertFunction: AttributeValueConverter<T, any>): void {
        this.converters.set(type, convertFunction)
    }

    convertTo<N>(new_attr_type: AttributeType<N>, value: T, param: object = {}): N {
        LoggerManager.logger.trace(`Converting "${value}" from ${this.type} to ${new_attr_type.type}`)
        const new_type_str: string = new_attr_type.type

        // return the ori value if they are in the same type
        if (this.type === new_type_str) {
            return value as unknown as N
        }

        if (this.isConvertibleTo(new_type_str)) {
            const converter = this.converters.get(new_type_str)
            if (converter){
                try {
                    let new_value = converter(value, param)
                    LoggerManager.logger.trace(`Converted new_value: "${new_value}"`)
                    return new_value
                } catch (e) {
                    throw new InvalidTypeConversionForDataException(this._type, new_type_str, value)
                }   
            }
        }
        throw new InvalidTypeConversionException(this.type, new_type_str)
    }

    clone(): AttributeType<T> {
        // as the type is singleton, just return itself
        return this
    }

    cloneFrom(other: AttributeType<T>): void {
        throw new Error("Method not supported. AttributeType is singleton.")
    }

    cloneDeepWithCustomizer(): AttributeType<T> {
        return this
    }

    /**
     * Check if the given value is valid regarding to this type
     * @param value the value to validate
     * @returns true if the value is valid, false otherwise
     */
    validate(value: T): boolean {
        return true
    }

    /**
     * Check if the attribute type is valid with the given constraint definition
     * @returns true if valid, false otherwise
     */
    validateWithConstraintDef(constraints: Constraint[]): OperationResult {
        // Check if all the required constraints are in the def
        for (let constraint of this.required_constraints) {
            if (!constraints.some(c => c.getType() === constraint)) {
                return OperationResult.invalid("structural.attribute.error.missing_constraint_for_attr_type", 
                    {constraint: constraint})
            }
        }
        return OperationResult.valid()
    }

    /**
     * Check if the attr def has all the required constraints.
     * If not, return the missing constraints that should be added.
     * @param constraints Existing constraints in the attr def
     * @returns New constrain to be added to the def
     */
    findMissingConstraint(constraints: Constraint[]): Constraint[] {
        let missing_constraints: Constraint[] = []
        for (let constraint of this.required_constraints) {
            if (!constraints.some(c => c.getType() === constraint)) {
                const constraint_constructor = ConstraintTypeToClassMap.get(constraint)!
                missing_constraints.push(new constraint_constructor())
            }
        }
        return missing_constraints
    }
}