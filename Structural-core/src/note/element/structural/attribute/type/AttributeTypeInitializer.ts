import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute"


export class AttributeTypeInitializer {
    static initialize(): void {
        StringAttribute.instance
        NumberAttribute.instance
        BooleanAttribute.instance
    }
}