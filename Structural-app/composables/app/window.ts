import { WebviewWindow, appWindow } from "@tauri-apps/api/window"
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
        await webview.once('tauri://created', function () {
            console.log("webview window successfully created")
        })
        
        await webview.once('tauri://error', function (e) {
            console.log("an error occurred during webview window creation", e)
        })

        return new_window_uuid
    }
}