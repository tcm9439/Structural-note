import { AttributeType, AttributeTypeEnum } from "./AttributeType.js"

export class MarkdownAttribute extends AttributeType<string> {    
    public static readonly TYPE: string = AttributeTypeEnum.MARKDOWN
    private static _instance: MarkdownAttribute

    constructor() {
        super(MarkdownAttribute.TYPE)
        this.addConvertibleType(AttributeTypeEnum.LONG_STRING, (value: string) => value)
    }

    get default_value(): string {
        return ""
    }

    static get instance(): MarkdownAttribute {
        if (!this._instance){
            this._instance = new MarkdownAttribute()
        }
        return this._instance
    }
}
