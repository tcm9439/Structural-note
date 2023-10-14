import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { IntegerAttribute, DecimalAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { InvalidTypeConversionException } from '@/note/element/structural/attribute/exception/AttributeException'

export class StringAttribute extends AttributeType<string> {    
    public static readonly TYPE: string = "STRING"

    /**
     * Singleton instance
     * Cannot be init here as it has circular dependency with IntAttribute/...
     */
    private static _instance: StringAttribute

    constructor() {
        super(StringAttribute.TYPE)
        this.addConvertibleType(IntegerAttribute.TYPE, this.convertToInteger)
        this.addConvertibleType(DecimalAttribute.TYPE, this.convertToDecimal)
    }

    convertToDecimal(value: string, mode?: any): number {
        let num = Number(value)
        if (isNaN(num)){
            throw new InvalidTypeConversionException(IntegerAttribute.TYPE, this.type, "not a number")
        }
        return num
    }

    convertToInteger(value: string, mode?: any): number {
        return Math.round(this.convertToDecimal(value))
    }

    static get instance(): StringAttribute {
        if (!this._instance){
            this._instance = new StringAttribute()
        }
        return this._instance
    }
}
