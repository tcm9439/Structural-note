import { ConstraintType } from "../constraint/Constraint.js"
import { AttributeType, AttributeTypeEnum } from "./AttributeType.js"
import { z } from "zod"

export const NumToStringParamJson = z.object({
    precision: z.number(),
}).required()

export class NumberAttribute extends AttributeType<number> {
    constructor(type: string) {
        super(type) 
        this.addAvailableConstraint(ConstraintType.MIN)
        this.addAvailableConstraint(ConstraintType.MAX)
        this.addAvailableConstraint(ConstraintType.UNIQUE)
    }

    get default_value(): number {
        return 0
    }

    static convertToString(value: number, param?: object): string {
        if (isNaN(value)){
            return ""
        }

        let precision = -1 // keep the whole number
        param = param ?? {}
        const param_json = NumToStringParamJson.safeParse(param)
        if (param_json.success) {
            precision = param_json.data.precision
        }
        if (precision < 0){
            return String(value)
        }
        return value.toFixed(precision)
    }
}

export class IntegerAttribute extends NumberAttribute {
    public static readonly TYPE: string = AttributeTypeEnum.INT
    private static _instance: IntegerAttribute

    constructor() {
        super(IntegerAttribute.TYPE)
        this.addConvertibleType(AttributeTypeEnum.STRING, NumberAttribute.convertToString)
    }

    static get instance(): IntegerAttribute {
        if (!this._instance){
            this._instance = new IntegerAttribute()
        }
        return this._instance
    }

    validate(value: number): boolean {
        // check if the value is a integer
        return Number.isInteger(value)
    }
}

export class DecimalAttribute extends NumberAttribute {
    public static readonly TYPE: string = AttributeTypeEnum.DECIMAL
    private static _instance: DecimalAttribute

    constructor() {
        super(DecimalAttribute.TYPE)
        this.addConvertibleType(AttributeTypeEnum.STRING, () => NumberAttribute.convertToString(-1))
    }

    static get instance(): DecimalAttribute {
        if (!this._instance){
            this._instance = new DecimalAttribute()
        }
        return this._instance
    }
}