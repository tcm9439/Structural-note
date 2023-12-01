import { UUID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/util/ComponentBase"
import { CloneUtil, Cloneable } from "@/common/Cloneable"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { Constrain, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain"
import { OperationResult, ValidOperationResult } from "@/common/OperationResult"
import { ForbiddenConstrain, IncompatibleConstrain } from "@/note/element/structural/attribute/exception/AttributeException"
import { EditPath, EditPathNode } from "@/note/util/EditPath"
import { z } from "zod"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"

export const AttributeDefinitionJson = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    attribute_type: z.string(),
    default_value: z.any().optional(),
}).required()


export class AttributeDefinition<T> extends ComponentBase implements EditPathNode, Cloneable<AttributeDefinition<T>> {
    private _name: string
    private _description: string
    private _attribute_type: AttributeType<T> | null
    private _constrains: Map<UUID, Constrain> = new Map()
    private _default_value: T | null = null
    private _require_constrain: RequireConstrain | null = null

    constructor(name?: string, attribute_type?: AttributeType<T>, description?: string) {
        super()
        this._name = name || ""
        this._attribute_type = attribute_type || null
        this._description = description || ""
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

    isOptionalAttr(): boolean {
        return this._require_constrain?.required === false
    }

    setDefaultValue(value: T | null): OperationResult {
        this._default_value = value
        if (value === null){
            return ValidOperationResult
        }
        return this.validate(value)
    }

    get attribute_type(): AttributeType<T> | null {
        return this._attribute_type
    }

    get constrains(): Map<UUID, Constrain> {
        return this._constrains
    }

    set attribute_type(value: AttributeType<T> ) {
		this._attribute_type = value;
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
        return this.constrains.get(index)
    }

    // step in each constrain
    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        let result: EditPath[] = []
        this.constrains.forEach((constrain) => {
            result.push(edit_path.clone().append(constrain.id))
        })
        return result
    }

    clone(): AttributeDefinition<T> {
        return CloneUtil.cloneDeepWithCloneable(this)
    }

    addConstrain(constrain: Constrain): Error | null {
        if (this._attribute_type !== null) {
            // check if the constrain is allowed by the attribute type
            if (!this._attribute_type.allowConstrain(constrain)) {
                return new ForbiddenConstrain(constrain.getType())
            }

            // check if the constrain is compatible with the existing constrains
            for (const [id, existing_constrain] of this.constrains) {
                if (!existing_constrain.isCompatibleTo(constrain)) {
                    return new IncompatibleConstrain(constrain.getType(), existing_constrain.getType())
                }
            }

            // pass all the checks, add the constrain
            // if constrain is requiredConstrain, check if it is required
            if (constrain instanceof RequireConstrain) {
                this._require_constrain = constrain
            }
            this._constrains.set(constrain.id, constrain)
        }
        return null
    }

    removeConstrain(constrain_id: UUID): void {
        // if constrain is requiredConstrain, set the required to false
        if (this._constrains.get(constrain_id)?.getType() == ConstrainType.REQUIRE) {
            this._require_constrain = null
        }
        this._constrains.delete(constrain_id)
    }

    getAvailableConstrains(): ConstrainType[] {
        if (this._attribute_type === null) {
            return []
        }
        let available_constraints = this._attribute_type.available_constraints

        // filter out the incompatible constrains w.r.t. the existing constrains
        for (const [id, constrain] of this.constrains) {
            available_constraints = available_constraints.filter((constrain_type) => {
                return constrain.isCompatibleToType(constrain_type)
            })
        }
        return available_constraints
    }

    /**
     * Check if the value pass all the constrains
     */
    validate(value: any): OperationResult {
        for (const [id, constrain] of this.constrains) {
            const result = constrain.validate(value)
            if (!result.valid) {
                return result
            }
        }
        return ValidOperationResult
    }


    static convertToType<O,N>(old_attr_def: AttributeDefinition<O>, new_attr_type: AttributeType<N>): AttributeDefinition<N> {
        const new_attr_def = new AttributeDefinition<N>()

        // copy the properties
        new_attr_def.id = old_attr_def.id
        new_attr_def.name = old_attr_def.name
        new_attr_def.description = old_attr_def.description
        new_attr_def.attribute_type = new_attr_type

        if (old_attr_def.attribute_type !== null) {
            // add the constrain to the new definition if it is allowed
            old_attr_def.constrains.forEach((constrain) => {
                if (new_attr_type.allowConstrain(constrain)) {
                    let error = new_attr_def.addConstrain(constrain)
                    if (error !== null) {
                        console.error("Fail to add the constrain to the new attribute definition.", error)
                    }
                }
            })

            // convert the default value
            if (old_attr_def.default_value_for_attr !== null) {
                let conversion_result = AttributeValue.convertValueForNewAttrDef(old_attr_def.default_value_for_attr, old_attr_def, new_attr_def)
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
        this._constrains = CloneUtil.cloneDeepWithCloneable(other._constrains)
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
        }
    }

    static loadFromJson(json: object): AttributeDefinition<any> | null {
        const result = AttributeDefinitionJson.safeParse(json)
        if (!result.success) {
            console.error("Failed to load AttributeDefinition from JSON", result.error)
            return null
        }
        const valid_json = result.data
        const attribute_type = AttributeType.getAttrType(valid_json.attribute_type)
        const def = new AttributeDefinition(valid_json.name, attribute_type, valid_json.description)
        def.id = valid_json.id
        def.setDefaultValue(valid_json.default_value)
        return def
    }

    /**
     * Check if the definition is valid.
     */
    validateDefinition(): OperationResult {
        // name not null
        if (this.name.trim() === "") {
            return {
                valid: false,
                invalid_message: "Attribute name cannot be empty."
            }
        }

        // attribute type not null
        if (this.attribute_type === null) {
            return {
                valid: false,
                invalid_message: `Attribute type cannot be empty for attribute "${this.name}"`
            }
        }

        // constrains valid
        for (const [id, constrain] of this.constrains) {
            const result = constrain.validate_constrain_result
            if (!result.valid) {
                result.invalid_message = `Constrain ${constrain.getType()} for attribute "${this.name}" is invalid: ${result.invalid_message}`
                return result
            }
        }

        // constrain is compatible to each other
        for (const [id, constrain] of this.constrains) {
            for (const [id2, constrain2] of this.constrains) {
                if (id !== id2 && !constrain.isCompatibleTo(constrain2)) {
                    return {
                        valid: false,
                        invalid_message: `Constrain ${constrain.getType()} is not compatible to constrain ${constrain2.getType()} for attribute "${this.name}"`
                    }
                }
            }
        }

        // default value valid
        if (this.explicit_default_value !== null) {
            const result = this.validate(this.explicit_default_value)
            if (!result.valid) {
                result.invalid_message = `Default value for attribute "${this.name}" is invalid: ${result.invalid_message}`
                return result
            }
        }

        return ValidOperationResult
    }
}
