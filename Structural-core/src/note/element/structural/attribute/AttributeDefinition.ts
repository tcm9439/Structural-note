import { UUID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/util/ComponentBase"
import { CloneUtil, Cloneable } from "@/common/Cloneable"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { Constrain, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { EditPath, EditPathNode } from "@/note/util/EditPath"
import { z } from "zod"

export const AttributeDefinitionJson = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    attribute_type: z.string()
}).required()


export class AttributeDefinition<T> extends ComponentBase implements EditPathNode, Cloneable<AttributeDefinition<T>> {
    private _name: string
    private _description: string
    private _attribute_type: AttributeType<T> | null
    private _constrains: Map<UUID, Constrain> = new Map()
    private _default_value: T | null = null
    
    constructor(name?: string, attribute_type?: AttributeType<T>, description?: string) {
        super()
        this._name = name || ""
        this._attribute_type = attribute_type || null
        this._description = description || ""
    }

    get default_value(): T | null {
        return this._default_value
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

    addConstrain(constrain: Constrain): void {
        if (this._attribute_type !== null) {
            // check if the constrain is allowed by the attribute type
            if (!this._attribute_type.allowConstrain(constrain)) {
                throw new Error("Constrain not allowed")
            }

            // check if the constrain is compatible with the existing constrains
            for (const [id, existing_constrain] of this.constrains) {
                if (!existing_constrain.isCompatibleTo(constrain)) {
                    throw new Error(`Constrain ${constrain.getType()} not compatible to ${existing_constrain.getType()}`)
                }
            }

            // pass all the checks, add the constrain
            this._constrains.set(constrain.id, constrain)
        }
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
    validate(value: any): ValidateResult {
        for (const [id, constrain] of this.constrains) {
            const result = constrain.validate(value)
            if (!result.valid) {
                return result
            }
        }
        return ValidValidateResult
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
                    new_attr_def.addConstrain(constrain)
                }
            })
        }

        return new_attr_def
    }

    cloneFrom(other: AttributeDefinition<T>): void {
        // id is not cloned
        this._name = CloneUtil.cloneDeepWithCloneable(other._name)
        this._description = CloneUtil.cloneDeepWithCloneable(other._description)
        this._attribute_type = CloneUtil.cloneDeepWithCloneable(other._attribute_type)
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
            attribute_type: this.attribute_type.type
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
        return def
    }
}
