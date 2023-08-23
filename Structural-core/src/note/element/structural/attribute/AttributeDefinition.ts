import { ComponentBase } from "@/note/util/ComponentBase"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"

export class AttributeDefinition<T> extends ComponentBase implements EditPathNode {
    private _name: string
    private _description: string
    private _optional: boolean
    private _attribute_type: AttributeType<T>
    // private _constrains: any[] = []
    
    constructor(name: string, attribute_type: AttributeType<T>, optional?: boolean, description?: string) {
        super()
        this._name = name
        this._attribute_type = attribute_type
        this._optional = optional || false
        this._description = description || ""
    }

    get attribute_type(): AttributeType<T> {
        return this._attribute_type
    }

    get name(): string {
        return this._name
    }

    get description(): string {
        return this._description
    }

    get optional(): boolean {
        return this._optional
    }

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return undefined
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        throw new EndOfEditPathError("AttributeDefinition")
    }
}
