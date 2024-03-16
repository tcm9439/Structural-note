import { AppRuntimeEnvironment, AppState } from "@structural-note/structural-core"
import { EditHistoryHandler, NoteFileHandler } from "./NoteFileHandler"
import { appWindow } from "@tauri-apps/api/window"

export class ShortcutHandler {
    static async breakIfNotTarui(){
        if (AppState.environment !== AppRuntimeEnvironment.TARUI){
            return
        }
    }
    
    static async saveHandler(){
        this.breakIfNotTarui()
        AppState.logger.trace("Save Shortcut is Triggered")
        if (await appWindow.isFocused()){
            NoteFileHandler.saveNote()
        }  
    }
    
    static async undoHandler(){
        this.breakIfNotTarui()
        AppState.logger.trace(await appWindow.title())
        AppState.logger.trace("Undo Shortcut is Triggered")
        if (await appWindow.isFocused()){
            EditHistoryHandler.undo()
        }
    }

    static async redoHandler(){
        this.breakIfNotTarui()
        AppState.logger.trace(await appWindow.title())
        AppState.logger.trace("Redo Shortcut is Triggered")
        if (await appWindow.isFocused()){
            EditHistoryHandler.redo()
        }
    }
}