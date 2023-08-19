import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"

export class NumberAttribute extends AttributeType<number> {
    public static readonly TYPE: string = "NUMBER"
    private static _instance: NumberAttribute

    constructor() {
        super(NumberAttribute.TYPE)
        this.addConvertibleType(StringAttribute.TYPE, this.convertToString)
    }

    convertToString(value: number, mode?: any): string {
        if (isNaN(value)){
            return ""
        }
        return String(value)
    }

    static get instance(): NumberAttribute {
        if (!this._instance){
            this._instance = new NumberAttribute()
        }
        return this._instance
    }

    create(definition: AttributeDefinition<number>, value: number): AttributeValue<number> {
        return new AttributeValue<number>(definition, value)
    }
}
