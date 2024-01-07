import { InvalidTypeConversionException } from '@/exception/AttributeException.js'
import { AttributeType, AttributeTypeEnum } from "./AttributeType.js"
import { ConstraintType } from "../constraint/Constraint.js"

export class StringAttribute extends AttributeType<string> {    
    constructor(type: string) {
        super(type)
        this.addAvailableConstraint(ConstraintType.REGEX)
    }

    get default_value(): string {
        return ""
    }

    static convertToDecimal(value: string, param?: object): number {
        let num = Number(value)
        if (isNaN(num)){
            throw new InvalidTypeConversionException(AttributeTypeEnum.INT, AttributeTypeEnum.STRING, "not a number")
        }
        return num
    }

    static convertToInteger(value: string, param?: object): number {
        return Math.round(StringAttribute.convertToDecimal(value))
    }
}

export class ShortStringAttribute extends StringAttribute {    
    public static readonly TYPE: string = AttributeTypeEnum.STRING

    /**
     * Singleton instance
     * Cannot be init here as it has circular dependency with IntAttribute/...
     */
    private static _instance: ShortStringAttribute

    constructor() {
        super(ShortStringAttribute.TYPE)
        this.addConvertibleType(AttributeTypeEnum.INT, StringAttribute.convertToInteger.bind(this))
        this.addConvertibleType(AttributeTypeEnum.DECIMAL, StringAttribute.convertToDecimal.bind(this))
        this.addConvertibleType(AttributeTypeEnum.LONG_STRING, (value: string) => value)

        this.addAvailableConstraint(ConstraintType.UNIQUE)
    }

    static get instance(): StringAttribute {
        if (!this._instance){
            this._instance = new ShortStringAttribute()
        }
        return this._instance
    }
}


export class LongStringAttribute extends StringAttribute {
    public static readonly TYPE: string = AttributeTypeEnum.LONG_STRING
    private static _instance: LongStringAttribute

    constructor() {
        super(LongStringAttribute.TYPE)
        this.addConvertibleType(AttributeTypeEnum.STRING, (value: string) => value)
        this.addConvertibleType(AttributeTypeEnum.MARKDOWN, (value: string) => value)
    }

    static get instance(): LongStringAttribute {
        if (!this._instance){
            this._instance = new LongStringAttribute()
        }
        return this._instance
    }
}
