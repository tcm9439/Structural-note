import { WebviewWindow } from "@tauri-apps/api/window"
import { Logger } from "structural-core"
import { v4 as uuidv4 } from "uuid"

export class WindowUtil {
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
            focus: true
        })
    
        // Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
        webview.once('tauri://created', function () {
            Logger.get().info("webview window successfully created")
        })
        
        webview.once('tauri://error', function (error) {
            Logger.get().error(`An error occurred during webview window creation ${error}`)
            Promise.reject("Fail to create new window.")
        })

        return new_window_uuid
    }
}