import { TranslatableText } from "@/common/Translatable"
import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer.js"
import { AppState, NuxtRuntimeConfig } from "@/view/state/AppState.js"
import { Consumer } from "@/common/CommonTypes.js"

/**
 * Initialize the module (structural-core).
 */
export class ModuleInit {
    static async init(
            runtimeConfig?: NuxtRuntimeConfig,
            save_callback?: Consumer,
            undo_callback?: Consumer,
            redo_callback?: Consumer,) {
        AppState.initEnvironment(runtimeConfig)
        await AppState.initLogger()
        await AppState.initAppSetting()
        
        AppState.logger.info("Initializing module...")
        // init attribute type
        AttributeTypeInitializer.initialize()
        AppState.initTranslationManager()
        TranslatableText.translationManager = AppState.translationManager
        AppState.initKeybinding(save_callback, undo_callback, redo_callback)
    }

    static async close() {
        AppState.logger.info("Closing module...")
        await AppState.logger.close()
    }
}