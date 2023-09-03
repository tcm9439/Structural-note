import { ComponentBase } from "@/note/util/ComponentBase"
import { CloneUtil } from "@/note/util/Cloneable"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import _ from "lodash"

export class AttributeDefinition<T> extends ComponentBase implements EditPathNode {
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

    cloneDeepWithCustomizer(): AttributeDefinition<T> | undefined {
        return undefined
    }
}
