import { ComponentBase } from "@/note/common"
import { AttributeType, AttributeValue } from "@/note/section/structural/attribute"

export class AttributeDefinition<T> extends ComponentBase {
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

    get attributeType(): AttributeType<T> {
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

    create(value: T): AttributeValue<T> {
        return this._attribute_type.create(this, value)
    }
}
