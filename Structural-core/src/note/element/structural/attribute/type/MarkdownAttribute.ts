import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { InvalidTypeConversionException } from '@/note/element/structural/attribute/exception/AttributeException'

export class MarkdownAttribute extends AttributeType<string> {    
    public static readonly TYPE: string = "MARKDOWN"
    private static _instance: MarkdownAttribute

    constructor() {
        super(MarkdownAttribute.TYPE)
    }

    static get instance(): MarkdownAttribute {
        if (!this._instance){
            this._instance = new MarkdownAttribute()
        }
        return this._instance
    }
}
