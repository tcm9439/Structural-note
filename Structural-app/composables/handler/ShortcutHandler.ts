import { AppState, ShortcutKeyPressEvent } from "structural-core"
import { EditHistoryHandler, NoteFileHandler } from "./NoteFileHandler"
import { appWindow } from "@tauri-apps/api/window"
import { listen } from '@tauri-apps/api/event'

export class ShortcutHandler {
    static async registerAllHandler(){
        const unlisten_save = await listen(ShortcutKeyPressEvent.SAVE, ShortcutHandler.saveHandler)
        const unlisten_undo = await listen(ShortcutKeyPressEvent.UNDO, ShortcutHandler.undoHandler)
        const unlisten_redo = await listen(ShortcutKeyPressEvent.REDO, ShortcutHandler.redoHandler)
        return [unlisten_save, unlisten_undo, unlisten_redo]
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