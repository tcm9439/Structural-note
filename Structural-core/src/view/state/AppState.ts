import { AppSetting } from "./AppSetting.js"
import { Logger, TauriLogger, WebLogger } from "@/common/Logger.js"
import { TranslationManager } from "@/common/TranslationManager.js"
import { Store } from "tauri-plugin-store-api"

export enum AppRuntimeEnvironment {
    TARUI = "tauri",
    WEB = "web",
}

export type NuxtRuntimeConfig = {
    public: {
        appEnv: string
        settingFilepath: string
    }
}

export class AppState {
    public static environment: AppRuntimeEnvironment = AppRuntimeEnvironment.WEB
    public static logger: Logger
    public static translationManager: TranslationManager
    private static appSettingFilepath: string
    private static appSetting: AppSetting

    public static initEnvironment(runtimeConfig?: NuxtRuntimeConfig){
        if (runtimeConfig !== undefined) {
            try {
                // If running by Nuxt (& Tauri)  => runtimeConfig is given
                // If running in unit test => runtimeConfig is not given
                const { appEnv, settingFilepath } = runtimeConfig.public
                if (appEnv === "tauri"){
                    AppState.environment = AppRuntimeEnvironment.TARUI
                }

                AppState.appSettingFilepath = settingFilepath
            } catch (error) {
                // logger is not initialized yet => use console.error
                console.error(`Error when getting tauriEnv from runtimeConfig: ${error}`)
            }
        }
    }

    public static async initLogger(){
        if (AppState.environment === AppRuntimeEnvironment.TARUI){
            AppState.logger = await TauriLogger.initLogger()
        } else {
            AppState.logger = await WebLogger.initLogger()
        }
        AppState.logger.debug("Logger initialized")
    }

    public static async initAppSetting(){
        AppState.logger.debug("Initializing appSetting...")
        if (AppState.environment === AppRuntimeEnvironment.TARUI 
            && AppState.appSettingFilepath !== undefined && AppState.appSettingFilepath !== ""){
            const store = new Store(AppState.appSettingFilepath)
            try {
                AppState.logger.debug("Loading appSetting from Tauri store...")
                let appSetting = await store.get<any>("appSetting")
                AppState.appSetting = AppSetting.fromJson(appSetting)
                AppState.logger.debug(`AppSetting loaded from Tauri store: ${JSON.stringify(appSetting)}`)
            } catch (error) {
                AppState.logger.error(`Error when getting appSetting from store: ${error}`)
            }
        } else {
            // else, use default setting
            AppState.appSetting = new AppSetting()
            AppState.logger.debug("appSetting initialized")
        }
    }

    public static getAppSetting(): AppSetting {
        return AppState.appSetting
    }

    public static setAppSetting(appSetting: AppSetting){
        AppState.appSetting = appSetting
        if (AppState.environment === AppRuntimeEnvironment.TARUI 
            && AppState.appSettingFilepath !== undefined && AppState.appSettingFilepath !== ""){
            const store = new Store(AppState.appSettingFilepath)
            store.set("appSetting", AppState.appSetting)
        }
    }

    public static initTranslationManager(){
        AppState.logger.debug("Initializing translationManager...")
        AppState.translationManager = new TranslationManager(AppState.appSetting.language)
        AppState.logger.debug("translationManager initialized")
    }
}