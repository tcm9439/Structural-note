import { AttributeDefinition, AttributeType, AttributeValue, NumberAttribute } from "@/note/section/structural/attribute"
import { InvalidTypeConversionException } from "@/note/section/structural/attribute/exception"

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
