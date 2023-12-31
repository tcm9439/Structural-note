import { LongStringAttribute, ShortStringAttribute } from "./StringAttribute.js"
import { IntegerAttribute, DecimalAttribute } from "./NumberAttribute.js"
import { BooleanAttribute } from "./BooleanAttribute.js"
import { MarkdownAttribute } from "./MarkdownAttribute.js"


export class AttributeTypeInitializer {
    static initialize(): void {
        ShortStringAttribute.instance
        LongStringAttribute.instance
        IntegerAttribute.instance
        DecimalAttribute.instance
        BooleanAttribute.instance
        MarkdownAttribute.instance
    }
}