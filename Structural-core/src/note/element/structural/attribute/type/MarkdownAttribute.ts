import { AttributeType, AttributeTypeEnum } from "@/note/element/structural/attribute/type/AttributeType"

export class MarkdownAttribute extends AttributeType<string> {    
    public static readonly TYPE: string = AttributeTypeEnum.MARKDOWN
    private static _instance: MarkdownAttribute

    constructor() {
        super(MarkdownAttribute.TYPE)
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
