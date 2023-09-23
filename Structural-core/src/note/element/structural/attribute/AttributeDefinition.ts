import { ComponentBase } from "@/note/util/ComponentBase"
import { CloneUtil, Cloneable } from "@/common/Cloneable"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import { z } from "zod"

export const AttributeDefinitionJson = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    optional: z.boolean(),
    attribute_type: z.string()
}).required()


export class AttributeDefinition<T> extends ComponentBase implements EditPathNode, Cloneable<AttributeDefinition<T>> {
    private _name: string
    private _description: string
    private _optional: boolean
    private _attribute_type: AttributeType<T> | null
    // private _constrains: any[] = []
    
    constructor(name?: string, attribute_type?: AttributeType<T>, optional?: boolean, description?: string) {
        super()
        this._name = name || ""
        this._attribute_type = attribute_type || null
        this._optional = optional || false
        this._description = description || ""
    }

    get attribute_type(): AttributeType<T> | null {
        return this._attribute_type
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

    get optional(): boolean {
        return this._optional
    }

    set optional(value: boolean) {
        this._optional = value
    }

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return undefined
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        throw new EndOfEditPathError("AttributeDefinition")
    }

    clone(): AttributeDefinition<T> {
        return CloneUtil.cloneDeepWithCloneable(this)
    }

    cloneFrom(other: AttributeDefinition<T>): void {
        // id is not cloned
        this._name = CloneUtil.cloneDeepWithCloneable(other._name)
        this._description = CloneUtil.cloneDeepWithCloneable(other._description)
        this._optional = CloneUtil.cloneDeepWithCloneable(other._optional)
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
            optional: this.optional,
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
        const def = new AttributeDefinition(valid_json.name, attribute_type, valid_json.optional, valid_json.description)
        def.id = valid_json.id
        return def
    }
}
