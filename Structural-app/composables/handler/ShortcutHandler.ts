import { AppRuntimeEnvironment, AppState, ShortcutKeyPressEvent } from "@structural-note/structural-core"
import { EditHistoryHandler, NoteFileHandler } from "./NoteFileHandler"
import { appWindow } from "@tauri-apps/api/window"
import { listen } from '@tauri-apps/api/event'

export class ShortcutHandler {
    static async registerAllHandler(){
        if (AppState.environment === AppRuntimeEnvironment.TARUI){
            return [
                await listen(ShortcutKeyPressEvent.SAVE, ShortcutHandler.saveHandler),
                await listen(ShortcutKeyPressEvent.UNDO, ShortcutHandler.undoHandler),
                await listen(ShortcutKeyPressEvent.REDO, ShortcutHandler.redoHandler),
            ]
        }

        return []
    }
    
    static async saveHandler(event: any){
        AppState.logger.trace("Save Shortcut is Triggered")
        if (await appWindow.isFocused()){
            NoteFileHandler.saveNote()
        }  
    }
    
    static async undoHandler(event: any){
        AppState.logger.trace(await appWindow.title())
        AppState.logger.trace("Undo Shortcut is Triggered")
        if (await appWindow.isFocused()){
            EditHistoryHandler.undo()
        }
    }

    static async redoHandler(event: any){
        AppState.logger.trace(await appWindow.title())
        AppState.logger.trace("Redo Shortcut is Triggered")
        if (await appWindow.isFocused()){
            EditHistoryHandler.redo()
        }
    }
}