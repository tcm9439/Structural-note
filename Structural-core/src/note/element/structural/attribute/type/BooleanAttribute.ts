import { AttributeType, AttributeTypeEnum } from "./AttributeType.js"
import { StringAttribute } from "./StringAttribute.js"

export class BooleanAttribute extends AttributeType<boolean> {
    public static readonly TYPE: string = AttributeTypeEnum.BOOLEAN
    private static _instance: BooleanAttribute

    constructor() {
        super(BooleanAttribute.TYPE)
        this.addConvertibleType(StringAttribute.TYPE, BooleanAttribute.convertToString)
    }

    get default_value(): boolean {
        return false
    }

    static convertToString(value: boolean, mode?: any): string {
        return String(value)
    }

    static get instance(): BooleanAttribute {
        if (!this._instance){
            this._instance = new BooleanAttribute()
        }
        return this._instance
    }
}
