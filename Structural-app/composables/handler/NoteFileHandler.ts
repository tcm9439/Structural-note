import { Note, EventConstant, AppState, FileAlreadyOpened } from "structural-core"
import { TauriFileSystem } from "tauri-fs-util"
import { tran } from "@/composables/app/translate"
import { WindowUtil } from "@/composables/app/window"

import { open, save } from "@tauri-apps/api/dialog"
import { basename } from "@tauri-apps/api/path"
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from '@tauri-apps/api/tauri'

import { Button } from "view-ui-plus"

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
    private static async loadFile(filename: string): Promise<Note> {
        let title: string = await NoteFileHandler.getTitle(filename)
        let content: string = await TauriFileSystem.instance.readTextFile(filename)
        let content_json = JSON.parse(content)
        let loaded_note = Note.loadFromJson(title, content_json)
        
        return Promise.resolve(loaded_note)
    }

    /**
     * Save a note to a file.
     * @param note The note to save.
     * @param filename The path of the file to save.
     */
    private static async saveToFile(note: Note, filename: string){
        AppState.logger.debug("Save to file: " + filename)
        let content: object = note.saveAsJson()
        let content_str = JSON.stringify(content)
        await TauriFileSystem.instance.writeTextFile(filename, content_str, false, true)
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
            AppState.logger.warn("The selected open path is an array. Use the first file.")
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
        AppState.logger.debug("Start saveNote. save-as-mode: " + save_as_mode)
        try {
            const { $viewState, $Message } = useNuxtApp()
            if ($viewState.editing_note === null){
                AppState.logger.info("No note is opened to save.")
                return
            }

            if (!$viewState.isNoteChange() && !save_as_mode){
                // no change to the note, not need to save
                return
            }

            // get the save path
            let this_save_path = $viewState.save_path
            if (this_save_path === null || save_as_mode){
                // there is no save path set or this is a save-as operation
                AppState.logger.debug("No save path is set or this is a save-as operation.")
                const default_note_filename = $viewState.editing_note.title + "." + struct_note_file_extension
                this_save_path = await NoteFileHandler.askSavePath(default_note_filename)
            }

            if (this_save_path === null){
                return Promise.reject("No path is chosen to save.")
            }
            
            await NoteFileHandler.saveToFile($viewState.editing_note, this_save_path)
    
            // if this is not save-as operation & update the save path
            if (!save_as_mode){
                $viewState.save_path = this_save_path
                $viewState.setSaveNote()
            }
            $Message.info(tran("structural.file.saved"))
            AppState.logger.debug("File saved successfully.")
        } catch (err) {
            AppState.logger.error("Error when trying to save Note.", err)
        }
    }

    static async createNote(title?: string){
        try {
            if (title === undefined || title.trim() === ""){
                title = tran("structural.file.untitled")
            }

            // create a new note
            let new_note = new Note(title)
            AppState.logger.info(`Created note with title ${title}`)
            this.openNote(new_note)
        } catch (err) {
            AppState.logger.error("Error when trying to create Note.", err)
        }
    }

    /**
     * Close the note. Ask for save.
     */
    static async closeNote(
            close_success_callback?: () => void, 
            close_cancel_callback?: () => void){
        const { $viewState, $emitter } = useNuxtApp()
        if ($viewState.editing_note === null){
            AppState.logger.warn("No note is opened to close.")
            return
        }
        
        let closeNoteCallback = () => {
            // throw away the note instance
            $viewState.closeNote()
            const window_id = appWindow.label
            invoke("remove_opened_file", { windowId: window_id })
            appWindow.setTitle("New Window")
            $emitter.emit(EventConstant.NOTE_CLOSED)
            if (close_success_callback){ close_success_callback() }
        }

        if ($viewState.isNoteChange()){
            AppState.logger.debug("Note is changed. Ask for save before closing window.")
            this.showAskForSaveBeforeCloseModal(closeNoteCallback, close_cancel_callback)
        } else {
            // close directly
            AppState.logger.debug("Note is not changed. Close window directly.")
            closeNoteCallback()
        }
    }

    private static showAskForSaveBeforeCloseModal(close_success_callback?: () => void, close_cancel_callback?: () => void){
        const { $Modal } = useNuxtApp()
        $Modal.confirm({
            title: tran("common.save_confirm_window.title", null, {
                target: tran("structural.file.note")
            }),
            okText: tran("common.save_confirm_window.save"),
            onOk: async () => {
                // button for closing with saving
                await NoteFileHandler.saveNote()
                if (close_success_callback){ close_success_callback() }
            },
            cancelText: tran("common.cancel"),
            onCancel: () => {
                // button for canceling the close operation
                if (close_cancel_callback){
                    close_cancel_callback()
                }
            },
            render: (h: any) => {
                // button for closing without saving
                return h('div', [
                        h('div', tran("common.save_confirm_window.content")),
                        h('div', [
                            h(Button, {
                                class: 'ivu-fr',
                                style: {
                                    "margin-top": "20px",
                                    "margin-left": "10px",
                                },
                                type: 'error',
                                onclick: () => {
                                    $Modal.remove() // close the modal
                                    if (close_success_callback){ close_success_callback() }
                                }
                            }, { 
                                default: () => h('span', tran("common.save_confirm_window.do_not_save"))
                            })
                        ])
                    ])
            }
        })
    }

    /**
     * Call when app init.
     * Check if there is a note for this window to open.
     */
    static async openInitNoteForThisWindow(): Promise<boolean>{
        try {
            const { $viewState } = useNuxtApp()
            const this_window_id = $viewState.window_id
            let note_path: string = await invoke("get_opened_note_for_window", { windowId: this_window_id })
            AppState.logger.debug(`Init window ${this_window_id} with note path: ${note_path}`)
            if (note_path != ""){
                AppState.logger.debug("Has opened note.")
                await NoteFileHandler.openNote(null, note_path, true)
                return true
            } else {
                AppState.logger.debug("No opened note.")
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
    static async openNote(note?: Note | null, filepath?: string | null, init_window_mode: boolean = false){
        const { $viewState, $emitter, $Message } = useNuxtApp()
        AppState.logger.trace(`Start openNote. note: ${note} | filepath: ${filepath} | init-window-mode: ${init_window_mode}`)

        try {
            // get the filepath from argument or dialog
            let selected_open_path: string | string[] | null = null
            if (note == null){
                // open file mode
                AppState.logger.trace("Load note from file mode.")
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
                        // cancel operation
                        $Message.info(tran("common.cancel"))
                        return
                    }
                }

                if (!init_window_mode){
                    AppState.logger.trace("Checking if the file is already opened...")
                    // check if the path is already opened in some window
                    // if init mode => skip as the file must be marked as "opened" in current window
                    let already_opened: boolean = await invoke("is_file_already_open", { filepath: selected_open_path })
                    if (already_opened){
                        return Promise.reject(new FileAlreadyOpened(selected_open_path))
                    }
                }
            }

            let window_id = $viewState.window_id
            let open_in_this_window = true
            if ($viewState.hasOpenNote()){
                AppState.logger.debug("This window has open note. Creating new window...")
                open_in_this_window = false
                window_id = WindowUtil.generateNewWindowId()
                WindowUtil.createNewWindow(window_id)
            } else {
                AppState.logger.debug("Open the note in current window.")
                if (selected_open_path != null){
                    note = await NoteFileHandler.loadFile(selected_open_path)
                    AppState.logger.debug(`note loaded ${note}`)
                    if (note == null){
                        AppState.logger.error("Fail to load note.")
                        return
                    }
                }

                if (note != null){
                    AppState.logger.debug(`Setting opened note...`)
                    $viewState.setOpenNote(note)
                    appWindow.setTitle(note.title)
                    $viewState.save_path = selected_open_path
                } else {
                    AppState.logger.debug(`No available note.`)
                    return
                }
                // emit the open note event
                $emitter.emit(EventConstant.NOTE_OPENED)
                appWindow.setTitle($viewState.editing_note.title)
            }

            // update the file state
            if (!init_window_mode){
                AppState.logger.trace("add file")
                await invoke("add_file", { windowId: window_id, filepath: selected_open_path })
            }
            if (open_in_this_window){
                AppState.logger.trace("init_file")
                await invoke("init_file", { windowId: window_id })
            }
        } catch (error) {
            AppState.logger.error("Error when trying to open Note.", error)
            return Promise.reject(error)
        }
    }
}

export class EditHistoryHandler {
    static undo(){
        const { $viewState } = useNuxtApp()
        AppState.logger.debug("Undo")
        $viewState.history.undo()
    }

    static redo(){
        const { $viewState } = useNuxtApp()
        AppState.logger.debug("Redo")
        $viewState.history.redo()
    }
}