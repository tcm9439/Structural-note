import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer"
import { Logger, TauriLogger, WebLogger } from "@/common/Logger"

type AppConfig = {
    public: {
        tauriEnv: boolean
    }
}

/**
 * Initialize the module (structural-core).
 */
export class ModuleInit {
    static inTauriEnv(runtimeConfig?: AppConfig): boolean{
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
        if (ModuleInit.inTauriEnv(runtimeConfig)) {
            await TauriLogger.initLogger()
        } else {
            WebLogger.initLogger()
        }
        Logger.get().info("Initializing module...")
        AttributeTypeInitializer.initialize()
    }

    static async close() {
        Logger.get().info("Closing module...")
        await Logger.get().close()
    }
}