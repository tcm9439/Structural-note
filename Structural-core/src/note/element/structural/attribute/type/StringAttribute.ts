import { InvalidTypeConversionException } from '@/exception/AttributeException.js'
import { AttributeType, AttributeTypeEnum } from "./AttributeType.js"
import { ConstrainType } from "../constrain/Constrain.js"

export class StringAttribute extends AttributeType<string> {    
    public static readonly TYPE: string = AttributeTypeEnum.STRING

    /**
     * Singleton instance
     * Cannot be init here as it has circular dependency with IntAttribute/...
     */
    private static _instance: StringAttribute

    constructor() {
        super(StringAttribute.TYPE)
        this.addConvertibleType(AttributeTypeEnum.INT, StringAttribute.convertToInteger.bind(this))
        this.addConvertibleType(AttributeTypeEnum.DECIMAL, StringAttribute.convertToDecimal.bind(this))
        this.addAvailableConstraint(ConstrainType.REGEX)
        this.addAvailableConstraint(ConstrainType.UNIQUE)
    }

    get default_value(): string {
        return ""
    }

    static convertToDecimal(value: string, mode?: any): number {
        let num = Number(value)
        if (isNaN(num)){
            throw new InvalidTypeConversionException(AttributeTypeEnum.INT, AttributeTypeEnum.STRING, "not a number")
        }
        return num
    }

    static convertToInteger(value: string, mode?: any): number {
        return Math.round(StringAttribute.convertToDecimal(value))
    }

    static get instance(): StringAttribute {
        if (!this._instance){
            this._instance = new StringAttribute()
        }
        return this._instance
    }
}
