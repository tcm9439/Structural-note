import { WebviewWindow } from "@tauri-apps/api/window"
import { appWindow } from "@tauri-apps/api/window"
import { AppState, AppRuntimeEnvironment } from "@structural-note/structural-core"
import { v4 as uuidv4 } from "uuid"

export class WindowUtil {
    static setWindowId(){
        const { $viewState } = useNuxtApp()
        if (AppState.environment === AppRuntimeEnvironment.TARUI){
            $viewState.window_id = appWindow.label
        }
    }

    static generateNewWindowId(): string {
        return uuidv4()
    }

    static async createNewWindow(new_window_uuid?: string, title = "New Window", url: string = ""){
        if (new_window_uuid == undefined) {
            new_window_uuid = WindowUtil.generateNewWindowId()
        }
        
        const webview = new WebviewWindow(new_window_uuid, {
            url: url,
            title: title,
            focus: true,
            height: 600,
            width: 800,
            minHeight: 400,
            minWidth: 600,
        })
    
        // Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
        webview.once('tauri://created', function () {
            AppState.logger.info("webview window successfully created")
        })
        
        webview.once('tauri://error', function (error) {
            AppState.logger.error(`An error occurred during webview window creation ${error}`)
            Promise.reject("Fail to create new window.")
        })

        return new_window_uuid
    }
}