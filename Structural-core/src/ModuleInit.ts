import { TranslatableText } from "@/common/Translatable.js"
import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer.js"
import { AppState, NuxtRuntimeConfig, AppRuntimeEnvironment } from "@/view/state/AppState.js"
import { Consumer } from "@/common/CommonTypes.js"

import { register, isRegistered, unregister } from '@tauri-apps/api/globalShortcut'

/**
 * Initialize the module (structural-core).
 */
export class ModuleInit {
    static async init(runtimeConfig?: NuxtRuntimeConfig, shortcut_list?: {key: string, callback: Consumer}[]) {
        AppState.initEnvironment(runtimeConfig)
        await AppState.initLogger()
        await AppState.initAppSetting()
        
        AppState.logger.info("Initializing module...")
        // init attribute type
        AttributeTypeInitializer.initialize()
        AppState.initTranslationManager()
        if (shortcut_list){ ModuleInit.initKeybinding(shortcut_list) }
        TranslatableText.translationManager = AppState.translationManager
    }

    private static async tryRegisterKeybinding(key: string, callback?: Consumer){
        AppState.logger.debug(`Try register keybinding: ${key}`)
        if (callback){
            // Some hotkey may already been registered by the web view 
            const is_registered = await isRegistered(key)
            if (is_registered){
                AppState.logger.debug(`Keybinding: ${key} already registered, unregister now...`)
                await unregister(key)
            }
            AppState.logger.debug(`Registering keybinding: ${key}...`)
            register(key, callback)
        }
    }

    // This key binding is GLOBAL!!
    // so even the app is not focused, it still trigger the callback
    private static initKeybinding(shortcut_list: {key: string, callback: Consumer}[]){
        AppState.logger.debug("Initializing keybinding...")
        if (AppState.environment === AppRuntimeEnvironment.TARUI){
            shortcut_list.forEach(shortcut => {
                ModuleInit.tryRegisterKeybinding(shortcut.key, shortcut.callback)
            })
        }
        AppState.logger.debug("keybinding initialized")
    }

    static async close() {
        AppState.logger.info("Closing module...")
        await AppState.logger.close()
    }
}