import { ID } from "@/common/CommonTypes.js"
import { Cloneable } from "@/common/Cloneable.js"
import { InvalidTypeConversionException, InvalidTypeConversionForDataException } from "@/exception/AttributeException.js"
import { ConstraintType, Constraint } from "../constraint/Constraint.js"
import { LoggerManager } from "@/common/Logger.js"

export enum AttributeTypeEnum {
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",
    MARKDOWN = "MARKDOWN",
    INT = "INT",
    DECIMAL = "DECIMAL",
}

export interface AttributeValueConverter<OriType,NewType> {
    (value: OriType, mode?: any): NewType
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
    private _converters: Map<string, Map<ID, AttributeValueConverter<T, any>>> = new Map()
    private _available_constraints: ConstraintType[] = [
        ConstraintType.REQUIRE
    ]

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

    allowConstraint(constraint: Constraint | ConstraintType): boolean {
        if (constraint instanceof Constraint) {
            return this.available_constraints.includes(constraint.getType())
        }
        return this.available_constraints.includes(constraint)
    }

    private get converters(): Map<string, Map<ID, AttributeValueConverter<T, any>>> {
        return this._converters
    }

    isConvertibleTo(type: string): boolean {
        return this.converters.has(type)
    }

    addConvertibleType(type: string, convertFunction: AttributeValueConverter<T, any>, mode: ID = 0): void {
        // check if the type already has > 1 converters
        if (this.converters.has(type)) {
            // add to the TYPE => converter map
            this.converters.get(type)?.set(mode, convertFunction)
        } else {
            // create the TYPE => converter map
            let converter_map = new Map()
            converter_map.set(mode, convertFunction)
            this.converters.set(type, converter_map)
        }
    }

    convertTo<N>(new_attr_type: AttributeType<N>, value: T, mode: ID = 0): N {
        LoggerManager.logger.trace(`Converting "${value}" from ${this.type} to ${new_attr_type.type}`)
        const new_type_str: string = new_attr_type.type

        // return the ori value if they are in the same type
        if (this.type === new_type_str) {
            return value as unknown as N
        }

        if (this.isConvertibleTo(new_type_str)) {
            const converter = this.converters.get(new_type_str)?.get(mode)
            if (converter){
                try {
                    let new_value = converter(value, mode)
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
}