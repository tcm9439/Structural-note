import { TauriFileSystem } from "tauri-fs-util"
import { open, save } from "@tauri-apps/api/dialog"
import { basename } from "@tauri-apps/api/path"
import { Note, EventConstant, NoteMarkdownConverter, Logger } from "structural-core"
import { WindowUtil } from "@/composables/app/window"
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from '@tauri-apps/api/tauri'

const struct_note_file_extension = "structnote"

export class NoteFileHandler {
    /**
     * Get the title of the note from the filename, which is the basename of the filename.
     */
    private static async getTitle(filename: string): Promise<string>{
        const base_filename = await basename(filename)
        const title = base_filename.replace("." + struct_note_file_extension, "")
        return Promise.resolve(title)
    }

    /**
     * Load a note from a file.
     * @param filename The path of the file to load.
     */
    private static loadFile(filename: string): Promise<Note> {
        return new Promise<Note>(async (resolve, reject) => {
            try {
                let title: string = await NoteFileHandler.getTitle(filename)
                let content: string = await TauriFileSystem.instance.readTextFile(filename)
                let content_json = JSON.parse(content)
                let loaded_note = Note.loadFromJson(title, content_json)
                
                if (loaded_note == null) {
                    reject("Invalid note file.")
                } else {
                    resolve(loaded_note)
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * Save a note to a file.
     * @param note The note to save.
     * @param filename The path of the file to save.
     */
    private static saveAsFile(note: Note, filename: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                let content: object = note.saveAsJson()
                let content_str = JSON.stringify(content)
                await TauriFileSystem.instance.writeTextFile(filename, content_str, false, true)
            } catch (error) {
                reject(error);
            }
        })
    }

    private static async askSavePath(default_note_filename: string): Promise<string | null> {
        return save({
            title: "Save",
            filters: [
                { name: "Note", extensions: [ struct_note_file_extension ] },
            ],
            defaultPath: default_note_filename
        })
    }

    static getPathFromSelectedFiles(selected_files: string | string[] | null): string | null {
        if (selected_files === null){
            return null
        } 

        // check if the selected open path is a String[]
        if (Array.isArray(selected_files)){
            console.warn("The selected open path is an array, which is not expected. Use the first file.")
            if (selected_files.length === 0){
                return null
            }
            return selected_files[0]
        }

        return selected_files
    }

    /**
     * Open a dialog to ask for save path (if no save-path is found).
     * And save the file to that path.
     * @param save_as_mode If this is call is for a save-as operation, which 1. won't update the save-path and 2. ask for path to save.
     */
    static async saveNote(save_as_mode: boolean = false){
        try {
            const { $viewState, $Message } = useNuxtApp()
            if ($viewState.editing_note === null){
                console.warn("No note is opened to save.")
                return
            }

            let this_save_path = $viewState.save_path
            if (this_save_path === null || save_as_mode){
                // there is no save path set or this is a save-as operation
                const default_note_filename = $viewState.editing_note.title + "." + struct_note_file_extension
                this_save_path = await this.askSavePath(default_note_filename)
            }
            if (this_save_path === null){
                return Promise.reject("No path is chosen to save.")
            } else {
                await NoteFileHandler.saveAsFile($viewState.editing_note, this_save_path)
            }
    
            if (!save_as_mode){
                $viewState.save_path = this_save_path
            }
            $Message.info("Saved")
        } catch (err) {
            console.error("Error when trying to save Note.", err);
        }
    }

    static async createNote(title: string){
        try {
            if (title.trim() === ""){
                return Promise.reject("Filename cannot be empty")
            }
            const { $viewState, $emitter } = useNuxtApp()

            // create a new note
            let new_note = new Note(title)
            console.log("Created note with title", title)
            console.log("viewState", $viewState)
            $viewState.editing_note = new_note

            appWindow.setTitle(new_note.title)
            $emitter.emit(EventConstant.NOTE_OPENED)
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Call when app init.
     * Check if there is a note for this window to open.
     */
    static async openInitNoteForThisWindow(this_window_id: string): Promise<boolean>{
        try {
            let note_path: string = await invoke("get_opened_note_for_window", { windowId: this_window_id })
            Logger.get().debug(`Init window with note path: ${note_path}`)
            if (note_path != ""){
                Logger.get().debug("Has opened note.")
                NoteFileHandler.openNote(this_window_id, true, note_path, true)
                return true
            } else {
                Logger.get().debug("No opened note.")
                return false
            }
        } catch (error){
            Promise.reject(error)
        }
        return false
    }
    
    /**
     * Open a note.
     * Open a dialog to ask for an exiting note to open.
     * The chosen path is kept as save-path which is used to save current file.
     * If this window already has a note opened, open it in another window.
     */
    static async openNote(this_window_id: string, open_in_this_window: boolean, filepath?: string | null, init_mode: boolean = false){
        const { $viewState, $emitter } = useNuxtApp()

        try {
            // get the filepath from argument or dialog
            let selected_open_path: string | string[] | null
            if (filepath != null){
                selected_open_path = filepath
            } else {
                selected_open_path = await open({
                    title: "Open",
                    multiple: false,
                    directory: false,
                    filters: [
                        { name: "Note", extensions: [ struct_note_file_extension ] },
                    ]
                })
                selected_open_path = this.getPathFromSelectedFiles(selected_open_path)
                if (selected_open_path === null){
                    return Promise.reject("Invalid path.")
                }
            }

            // check if the path is already opened
            if (!init_mode){
                let already_opened: boolean = await invoke("is_file_already_open", { filepath: selected_open_path })
                if (already_opened){
                    return Promise.reject("File is already opened in another window.")
                }
            }

            let window_id = this_window_id
            if (open_in_this_window){
                // selected_open_path === String
                $viewState.editing_note = await NoteFileHandler.loadFile(selected_open_path)
                console.log("note:", $viewState.editing_note)
                // set default save path as the open path
                $viewState.save_path = selected_open_path
                // emit the open note event
                $emitter.emit(EventConstant.NOTE_OPENED)
                appWindow.setTitle($viewState.editing_note.title)
            } else {
                console.log("create new window..")
                window_id = WindowUtil.generateNewWindowId()
                WindowUtil.createNewWindow(window_id)
            }

            // update the file state
            if (!init_mode){
                // init mode => already added to file list
                await invoke("add_file", { windowId: window_id, filepath: selected_open_path })
            } 
            await invoke("init_file", { windowId: window_id, filepath: selected_open_path })
        } catch (error) {
            Promise.reject(error)
        }
    }
}

export class NoteExportHandler {
    private static async askForSavePath(export_file_extension: string, default_note_filename: string): Promise<string | null> {
        const save_path = await save({
            title: "Save",
            filters: [
                { name: "Export File Type", extensions: [ export_file_extension ] },
            ],
            defaultPath: default_note_filename
        })

        return save_path
    }

    /**
     * Convert the Note to a markdown file.
     * Open a dialog for choosing a path to save the markdown file.
     */
    static async exportToMarkdown(){
        try {
            const { $viewState, $emitter } = useNuxtApp();

            if ($viewState.editing_note === null){
                console.warn("No note is opened to save.")
                return
            }

            const selected_export_path = await this.askForSavePath("md", $viewState.editing_note.title)
            
            if (selected_export_path === null){
                console.warn("No path is chosen to open.")
                return
            } 
    
            // selected_open_path === String
            const converter = new NoteMarkdownConverter()
            const converted_content = converter.convert($viewState.editing_note)
            await TauriFileSystem.instance.writeTextFile(selected_export_path, converted_content, false, true)
        } catch (err) {
            console.error(err);
        }
    }
}