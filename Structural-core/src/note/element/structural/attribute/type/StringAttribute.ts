import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { InvalidTypeConversionException } from '@/note/element/structural/attribute/exception/AttributeException'

export class StringAttribute extends AttributeType<string> {    
    public static readonly TYPE: string = "STRING"
    private static _instance: StringAttribute

    constructor() {
        super(StringAttribute.TYPE)
        this.addConvertibleType(NumberAttribute.TYPE, this.convertToNumber)
    }

    convertToNumber(value: string, mode?: any): number {
        let num = Number(value)
        if (isNaN(num)){
            throw new InvalidTypeConversionException(NumberAttribute.TYPE, this.type, "not a number")
        }
        return num
    }

    static get instance(): StringAttribute {
        if (!this._instance){
            this._instance = new StringAttribute()
        }
        return this._instance
    }

    create(definition: AttributeDefinition<string>, value: string): AttributeValue<string> {
        return new AttributeValue<string>(definition, value)
    }
}
