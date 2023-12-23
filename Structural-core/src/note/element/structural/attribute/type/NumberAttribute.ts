import { ConstrainType } from "../constrain/Constrain.js"
import { AttributeType, AttributeTypeEnum } from "./AttributeType.js"
import { StringAttribute } from "./StringAttribute.js"

export class NumberAttribute extends AttributeType<number> {
    constructor(type: string) {
        super(type) 
        this.addAvailableConstraint(ConstrainType.MIN)
        this.addAvailableConstraint(ConstrainType.MAX)
        this.addAvailableConstraint(ConstrainType.UNIQUE)
    }

    get default_value(): number {
        return 0
    }

    static convertToString(value: number, mode?: any): string {
        if (isNaN(value)){
            return ""
        }
        if (mode === undefined){
            mode = 0
        }

        if (mode == -1){
            return String(value)
        }
        return value.toFixed(mode)
    }
}

export class IntegerAttribute extends NumberAttribute {
    public static readonly TYPE: string = AttributeTypeEnum.INT
    private static _instance: IntegerAttribute

    constructor() {
        super(IntegerAttribute.TYPE)
        this.addConvertibleType(StringAttribute.TYPE, NumberAttribute.convertToString)
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
        this.addConvertibleType(StringAttribute.TYPE, () => NumberAttribute.convertToString(-1))
    }

    static get instance(): DecimalAttribute {
        if (!this._instance){
            this._instance = new DecimalAttribute()
        }
        return this._instance
    }
}