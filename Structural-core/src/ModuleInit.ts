import { TranslatableText } from "@/common/Translatable"
import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer.js"
import { AppState, NuxtRuntimeConfig } from "@/view/state/AppState.js"

/**
 * Initialize the module (structural-core).
 */
export class ModuleInit {
    static async init(runtimeConfig?: NuxtRuntimeConfig) {
        AppState.initEnvironment(runtimeConfig)
        await AppState.initLogger()
        await AppState.initAppSetting()
        
        AppState.logger.info("Initializing module...")
        // init attribute type
        AttributeTypeInitializer.initialize()
        AppState.initTranslationManager()
        TranslatableText.translationManager = AppState.translationManager
    }

    static async close() {
        AppState.logger.info("Closing module...")
        await AppState.logger.close()
    }
}