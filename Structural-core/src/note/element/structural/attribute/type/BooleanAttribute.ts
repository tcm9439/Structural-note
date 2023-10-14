import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"

export class BooleanAttribute extends AttributeType<boolean> {
    public static readonly TYPE: string = "BOOLEAN"
    private static _instance: BooleanAttribute

    constructor() {
        super(BooleanAttribute.TYPE)
        this.addConvertibleType(StringAttribute.TYPE, this.convertToString)
    }

    convertToString(value: boolean, mode?: any): string {
        return String(value)
    }

    static get instance(): BooleanAttribute {
        if (!this._instance){
            this._instance = new BooleanAttribute()
        }
        return this._instance
    }
}