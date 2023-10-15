import { ConstrainType } from "@/index"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"

export class NumberAttribute extends AttributeType<number> {
    constructor(type: string) {
        super(type)
        this.addConvertibleType(StringAttribute.TYPE, this.convertToString.bind(this))
        this.addAvailableConstraint(ConstrainType.MIN)
        this.addAvailableConstraint(ConstrainType.MAX)
        this.addAvailableConstraint(ConstrainType.UNIQUE)
    }

    convertToString(value: number, mode?: any): string {
        if (isNaN(value)){
            return ""
        }
        return String(value)
    }
}

export class IntegerAttribute extends NumberAttribute {
    public static readonly TYPE: string = "INT"
    private static _instance: IntegerAttribute

    constructor() {
        super(IntegerAttribute.TYPE)
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
    public static readonly TYPE: string = "DECIMAL"
    private static _instance: DecimalAttribute

    constructor() {
        super(DecimalAttribute.TYPE)
    }

    static get instance(): DecimalAttribute {
        if (!this._instance){
            this._instance = new DecimalAttribute()
        }
        return this._instance
    }
}