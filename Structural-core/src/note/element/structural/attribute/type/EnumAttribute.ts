import { InvalidTypeConversionException } from '@/exception/AttributeException.js'
import { AttributeType, AttributeTypeEnum } from "./AttributeType.js"
import { ConstraintType } from "../constraint/Constraint.js"
import { z } from 'zod'

export const EnumToStringParamJson = z.object({
    enum: z.map(z.number(), z.string()),
}).required()

export class EnumAttribute extends AttributeType<number> {    
    public static readonly TYPE: string = AttributeTypeEnum.ENUM

    /**
     * Singleton instance
     * Cannot be init here as it has circular dependency with IntAttribute/...
     */
    private static _instance: EnumAttribute

    static get instance(): EnumAttribute {
        if (!this._instance){
            this._instance = new EnumAttribute()
        }
        return this._instance
    }

    constructor() {
        super(EnumAttribute.TYPE)
        this.addAvailableConstraint(ConstraintType.REQUIRE)
        this.addAvailableConstraint(ConstraintType.ENUM)
        this.addRequiredConstraint(ConstraintType.ENUM)
    }

    get default_value(): number {
        return 0
    }

    static convertToString(value: number, param?: object): string {
        param = param ?? {}
        const param_json = EnumToStringParamJson.safeParse(param)
        if (!param_json.success) {
            throw new InvalidTypeConversionException(AttributeTypeEnum.ENUM, AttributeTypeEnum.STRING, "invalid param")
        }
        const valid_param = param_json.data
        if (!valid_param.enum.has(value)) {
            throw new InvalidTypeConversionException(AttributeTypeEnum.ENUM, AttributeTypeEnum.STRING, "invalid value - not in enum list")
        }
        return valid_param.enum.get(value)!
    }
}