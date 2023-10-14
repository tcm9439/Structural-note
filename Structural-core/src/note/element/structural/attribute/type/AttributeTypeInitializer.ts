import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { IntegerAttribute, DecimalAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute"


export class AttributeTypeInitializer {
    static initialize(): void {
        StringAttribute.instance
        IntegerAttribute.instance
        DecimalAttribute.instance
        BooleanAttribute.instance
    }
}