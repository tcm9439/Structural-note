import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer"
import { Logger } from "@/common/Logger"

export class ModuleInit {
    static async init() {
        await Logger.initLogger()
        Logger.info("Initializing module...")
        AttributeTypeInitializer.initialize()
    }

    static async close() {
        Logger.info("Closing module...")
        await Logger.close()
    }
}