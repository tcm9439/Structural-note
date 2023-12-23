import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer.js"
import { Logger, TauriLogger, WebLogger } from "@/common/Logger.js"

type AppConfig = {
    public: {
        tauriEnv: boolean
    }
}

/**
 * Initialize the module (structural-core).
 */
export class ModuleInit {
    static isInTauriEnv(runtimeConfig?: AppConfig): boolean{
        if (runtimeConfig === undefined) {
            return false
        }
        try {
            // If running by Nuxt (& Tauri)  => runtimeConfig is given
            // If running in unit test => runtimeConfig is not given
            const { tauriEnv } = runtimeConfig.public
            return tauriEnv
        } catch (error) {
            return false
        }
    }

    static async init(runtimeConfig?: AppConfig) {
        // init logger
        if (ModuleInit.isInTauriEnv(runtimeConfig)) {
            await TauriLogger.initLogger()
        } else {
            WebLogger.initLogger()
        }
        Logger.get().info("Initializing module...")

        // init attribute type
        AttributeTypeInitializer.initialize()
        // init translationManager
    }

    static async close() {
        Logger.get().info("Closing module...")
        await Logger.get().close()
    }
}