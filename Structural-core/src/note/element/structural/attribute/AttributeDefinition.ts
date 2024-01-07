import { UUID } from "@/common/CommonTypes.js"
import { CloneUtil, Cloneable } from "@/common/Cloneable.js"
import { TranslatableText } from "@/common/Translatable.js"
import { LoggerManager } from "@/common/Logger.js"
import { ComponentBase } from "@/note/util/ComponentBase.js"
import { EditPath, EditPathNode } from "@/note/util/EditPath.js"
import { OperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { ForbiddenConstraint, IncompatibleConstraint } from "@/exception/AttributeException.js"
import { Constraint, ConstraintType, ConstraintJson } from "./constraint/Constraint.js"
import { AttributeType, AttributeTypeEnum } from "./type/AttributeType.js"
import { RequireConstraint } from "./constraint/RequireConstraint.js"
import { UniqueConstraint } from "./constraint/UniqueConstraint.js"
import { MaxConstraint } from "./constraint/MaxConstraint.js"
import { MinConstraint } from "./constraint/MinConstraint.js"
import { EnumConstraint } from "./constraint/EnumConstraint.js"
import { AttributeValue } from "./value/AttributeValue.js"
import { getAllRelatedValuesFunc } from "@/note/section/StructuralSection.js"
import { z } from "zod"

export const AttributeDefinitionJson = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    attribute_type: z.string(),
    default_value: z.any().optional(),
    constraints: z.array(ConstraintJson.passthrough())
}).required()

/**
 * Definition of an attribute inside a structural definition.
 * 
 * When adding properties, remember to update the cloneFrom method.
 */
export class AttributeDefinition<T> extends ComponentBase implements EditPathNode, Cloneable<AttributeDefinition<T>> {
    private _name: string
    private _description: string
    private _attribute_type: AttributeType<T> | null = null
    private _default_value: T | null = null

    private _constraints: Map<UUID, Constraint> = new Map()
    private _num_constraints_related_to_other_values: number = 0
    private _require_constraint: UUID | null = null
    private _get_all_related_values_func: getAllRelatedValuesFunc
    
    /**
     * An attribute default to be 
     * - optional
     * - no description
     */
    constructor(name?: string, attribute_type?: AttributeType<T>, description?: string, get_all_related_values_func?: getAllRelatedValuesFunc) {
        super()
        this._name = name || ""
        this._description = description || ""

        if (attribute_type !== undefined) {
            this.attribute_type = attribute_type
        }
        
        this._get_all_related_values_func = get_all_related_values_func || ((id) => [])
    }

    setGetAllRelatedValuesFunc(value: getAllRelatedValuesFunc) {
        this._get_all_related_values_func = value
    }

    getGetAllRelatedValuesFunc(): getAllRelatedValuesFunc {
        return this._get_all_related_values_func
    }

    /**
     * Get the explicit_default_value set by user.
     * If it doesn't exists, get the implicit default value determined by the attr type.
     */
    get default_value_for_attr(): T | null {
        if (this._default_value !== null){
            return this._default_value
        }
        if (this.attribute_type !== null){
            return this.attribute_type.default_value
        }
        return null
    }

    get explicit_default_value(): T | null {
        return this._default_value
    }

    /**
     * Check if this is an optional attribute.
     * Which is defined as an attribute with a require_constraint = true
     */
    isOptionalAttr(): boolean {
        return this._require_constraint === null
    }

    setDefaultValue(value: T | null): OperationResult {
        this._default_value = value
        if (value === null){
            return OperationResult.valid()
        }
        // not need to validated with related values (e.g. for unique constraint)
        return this.validate(value)
    }

    get attribute_type(): AttributeType<T> | null {
        return this._attribute_type
    }

    get constraints(): Map<UUID, Constraint> {
        return this._constraints
    }

    get require_constraint(): RequireConstraint | null {
        if (this._require_constraint === null) {
            return null
        }
        return this.constraints.get(this._require_constraint) as RequireConstraint
    }

    set attribute_type(value: AttributeType<T> ) {
		this._attribute_type = value
        let missing_constraints = this._attribute_type.findMissingConstraint([...this.constraints.values()])
        missing_constraints.forEach((constraint) => {
            this.addConstraint(constraint)
        })
	}

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get description(): string {
        return this._description
    }

    set description(value: string) {
        this._description = value
    }

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return this.constraints.get(index)
    }

    // step in each constraint
    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        let result: EditPath[] = []
        this.constraints.forEach((constraint) => {
            result.push(edit_path.clone().append(constraint.id))
        })
        return result
    }

    clone(): AttributeDefinition<T> {
        return CloneUtil.cloneDeepWithCloneable(this)
    }

    /**
     * Add a constraint to the attribute definition.
     * @param constraint 
     * @returns Error if the constraint is not allowed or incompatible with the existing constraints. Null if the constraint is added successfully.
     */
    addConstraint(constraint: Constraint): Error | null {
        if (this._constraints.has(constraint.id)) {
            // constraint already exists
            return null
        }

        // check if the constraint is allowed by the attribute type
        if (this._attribute_type !== null && !this._attribute_type.allowConstraint(constraint)) {
            return new ForbiddenConstraint(constraint.getType())
        }

        // check if the constraint is compatible with the existing constraints
        for (const [id, existing_constraint] of this.constraints) {
            if (!existing_constraint.isCompatibleTo(constraint)) {
                return new IncompatibleConstraint(constraint.getType(), existing_constraint.getType())
            }
        }

        // pass all the checks, add the constraint
        // if constraint is requiredConstraint, check if it is required
        if (constraint instanceof RequireConstraint) {
            this._require_constraint = constraint.id
        }

        if (constraint.isRelatedToOtherValues()) {
            this._num_constraints_related_to_other_values += 1
        }

        this._constraints.set(constraint.id, constraint)
        return null
    }

    removeConstraint(constraint_id: UUID): void {
        // if constraint is requiredConstraint, set the required to default (false)
        if (this._require_constraint === constraint_id) {
            this._require_constraint = null
        } 

        if (this.constraints.get(constraint_id)?.isRelatedToOtherValues()) {
            this._num_constraints_related_to_other_values -= 1
        }
        this._constraints.delete(constraint_id)
    }

    getConstraint(constraint_type: ConstraintType): Constraint | null {
        for (const [id, constraint] of this.constraints) {
            if (constraint.getType() === constraint_type) {
                return constraint
            }
        }
        return null
    }

    getIsRelatedToOtherValues(): boolean {
        return this._num_constraints_related_to_other_values > 0
    }

    getAllRelatedValues(): any[] {
        if (this._get_all_related_values_func) {
            return this._get_all_related_values_func(this.id)
        }
        return []
    }

    getAvailableConstraints(): ConstraintType[] {
        if (this._attribute_type === null) {
            return []
        }
        let available_constraints = this._attribute_type.available_constraints

        // filter out the incompatible constraints w.r.t. the existing constraints
        for (const [id, constraint] of this.constraints) {
            available_constraints = available_constraints.filter((constraint_type) => {
                return constraint.isCompatibleToType(constraint_type)
            })
        }
        return available_constraints
    }

    /**
     * Check if the value pass all the constraints
     */
    validate(value: any): OperationResult {
        for (const [id, constraint] of this.constraints) {
            const result = constraint.validate(value)
            if (!result.valid) {
                return result
            }
        }
        return OperationResult.valid()
    }

    validateValueGroup(values?: any[]): OperationResult {
        if (this.getIsRelatedToOtherValues()){
            if (values === undefined) {
                values = this.getAllRelatedValues()
            }
            for (const [id, constraint] of this.constraints) {
                const result = constraint.validateValueGroup(values)
                if (!result.valid) {
                    return result
                }
            }
        }
        // not related to other values, return valid
        return OperationResult.valid()
    }


    static convertToType<O,N>(old_attr_def: AttributeDefinition<O>, new_attr_type: AttributeType<N>): AttributeDefinition<N> {
        const new_attr_def = new AttributeDefinition<N>()
        new_attr_def.setGetAllRelatedValuesFunc(old_attr_def.getGetAllRelatedValuesFunc())

        // copy the properties
        new_attr_def.id = old_attr_def.id
        new_attr_def.name = old_attr_def.name
        new_attr_def.description = old_attr_def.description
        new_attr_def.attribute_type = new_attr_type

        if (old_attr_def.attribute_type !== null) {
            // add the constraint to the new definition if it is allowed
            old_attr_def.constraints.forEach((constraint) => {
                if (new_attr_type.allowConstraint(constraint)) {
                    let error = new_attr_def.addConstraint(constraint)
                    if (error !== null) {
                        LoggerManager.logger.warn(`Fail to add the constraint to the new attribute definition. ${error}`)
                    }
                }
            })

            // convert the default value
            if (old_attr_def.explicit_default_value !== null) {
                let conversion_result = AttributeValue.convertValueForNewAttrDef(old_attr_def.explicit_default_value, old_attr_def, new_attr_def)
                new_attr_def.setDefaultValue(conversion_result)
            }
        }

        return new_attr_def
    }

    cloneFrom(other: AttributeDefinition<T>): void {
        // id is not cloned
        this._name = CloneUtil.cloneDeepWithCloneable(other._name)
        this._description = CloneUtil.cloneDeepWithCloneable(other._description)
        this._attribute_type = CloneUtil.cloneDeepWithCloneable(other._attribute_type)
        this._default_value = CloneUtil.cloneDeepWithCloneable(other._default_value)
        this._constraints = CloneUtil.cloneDeepWithCloneable(other._constraints)
        this.setGetAllRelatedValuesFunc(other.getGetAllRelatedValuesFunc())
        this._num_constraints_related_to_other_values = other._num_constraints_related_to_other_values
    }

    cloneDeepWithCustomizer(): AttributeDefinition<T> | undefined {
        return undefined
    }

    saveAsJson(): z.infer<typeof AttributeDefinitionJson> {
        if (this.attribute_type === null) {
            throw new Error("Attribute type is null")
        }
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            attribute_type: this.attribute_type.type,
            default_value: this.explicit_default_value,
            constraints: Array.from(this.constraints.values()).map((constraint) => {
                return constraint.saveAsJson()
            })
        }
    }

    static loadFromJson(json: object, get_all_related_values_func: getAllRelatedValuesFunc): AttributeDefinition<any> {
        const result = AttributeDefinitionJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("AttributeDefinition", result.error.toString())
        }
        const valid_json = result.data
        const attribute_type = AttributeType.getAttrType(valid_json.attribute_type)
        const def = new AttributeDefinition(valid_json.name, attribute_type, valid_json.description, get_all_related_values_func)
        def.id = valid_json.id
        def.constraints.clear() // remove the default require_constraint
        def.setDefaultValue(valid_json.default_value)

        // load constraints
        valid_json.constraints.forEach((constraint_json) => {
            let constraint: Constraint
            if (constraint_json.type === "RequireConstraint") {
                constraint = RequireConstraint.loadFromJson(constraint_json)
            } else if (constraint_json.type === "MinConstraint") {
                constraint = MinConstraint.loadFromJson(constraint_json)
            } else if (constraint_json.type === "MaxConstraint") {
                constraint = MaxConstraint.loadFromJson(constraint_json)
            } else if (constraint_json.type === "UniqueConstraint") {
                constraint = UniqueConstraint.loadFromJson(constraint_json)
            } else if (constraint_json.type === "EnumConstraint") {
                constraint = EnumConstraint.loadFromJson(constraint_json)
            } else {
                throw new InvalidJsonFormatException("AttributeDefinition", `Unknown constraint type: ${constraint_json.type}`)
            }
            def.addConstraint(constraint)
        })

        return def
    }

    /**
     * Check if the definition is valid.
     */
    validateDefinition(): OperationResult {
        // name not null
        if (this.name.trim() === "") {
            return OperationResult.invalid("structural.attribute.error.empty_attr_name")
        }

        // attribute type not null
        if (this.attribute_type === null) {
            return OperationResult.invalid("structural.attribute.error.empty_attr_type", {
                name: this.name
            })
        }

        // constraints validate with the attribute type
        const constraint_type_validate_result = this.attribute_type.validateWithConstraintDef([...this.constraints.values()])
        if (!constraint_type_validate_result.valid) {
            let error_text = TranslatableText.new("structural.attribute.error.general_invalid_attr", {
                    attr_name: this.name
                }).addElement(TranslatableText.new('symbol.colon'))
                .addElement(constraint_type_validate_result.getRawInvalidMessage()!)

            return OperationResult.invalidText(error_text)
        }

        // constraints valid
        for (const [id, constraint] of this.constraints) {
            const result = constraint.validate_constraint_result
            if (!result.valid) {
                return OperationResult.invalidText(
                    TranslatableText.new("structural.attribute.error.invalid_constraint_for_attr", {
                        attr_name: this.name,
                        constraint: TranslatableText.new(constraint.getTypeTranslationKey())
                    }).addElement(result.getRawInvalidMessage() as TranslatableText)
                )
            }
        }

        // constraint is compatible to each other
        for (const [id, constraint] of this.constraints) {
            for (const [id2, constraint2] of this.constraints) {
                if (id !== id2 && !constraint.isCompatibleTo(constraint2)) {
                    return OperationResult.invalidText(
                        TranslatableText.new("structural.attribute.error.incompatible_constraint_for_attr", {
                            attr_name: this.name,
                            constraint_a: TranslatableText.new(constraint.getTypeTranslationKey()),
                            constraint_b: TranslatableText.new(constraint2.getTypeTranslationKey()),
                        }))
                }
            }
        }

        // default value valid
        // not need to validated with related values (e.g. for unique constraint)
        if (this.explicit_default_value !== null) {
            const result = this.validate(this.explicit_default_value)
            if (!result.valid) {
                return OperationResult.invalidText(
                    TranslatableText.new("structural.attribute.error.invalid_default_value_for_attr", {
                        attr_name: this.name
                    }).addElement(result.getRawInvalidMessage() as TranslatableText)
                )
            }
        }

        return OperationResult.valid()
    }
}
