import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer"

export class ModuleInit {
    static init() {
        AttributeTypeInitializer.initialize()
    }
}