import { TauriFileSystem } from "tauri-fs-util"
import { open, save } from "@tauri-apps/api/dialog"
import { basename } from "@tauri-apps/api/path"
import { Note, EventConstant } from "structural-core"

const struct_note_file_extension = "structnote"

export class NoteFileHandler {
    private static async getTitle(filename: string): Promise<string>{
        const base_filename = await basename(filename)
        const title = base_filename.replace("." + struct_note_file_extension, "")
        return Promise.resolve(title)
    }

    private static loadFile(filename: string): Promise<Note> {
        return new Promise<Note>(async (resolve, reject) => {
            try {
                let title: string = await NoteFileHandler.getTitle(filename)
                let content: string = await TauriFileSystem.instance.readTextFile(filename)
                let content_json = JSON.parse(content)
                let loaded_note = Note.loadFromJson(title, content_json)
                
                if (loaded_note == null) {
                    reject("Invalid note file")
                } else {
                    resolve(loaded_note);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

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

    static async saveNote(save_as_mode: boolean = false){
        try {
            const { $viewState, $Message } = useNuxtApp();
            if ($viewState.editing_note === null){
                console.warn("No note is opened to save.")
                return
            }

            let this_save_path = $viewState.save_path
            if (this_save_path === null || save_as_mode){
                // there is no save path set,
                // ask the user to chose a save path
                const default_note_filename = $viewState.editing_note.title + "." + struct_note_file_extension
                this_save_path = await save({
                    title: "Save",
                    filters: [
                        { name: "Note", extensions: [ struct_note_file_extension ] },
                    ],
                    defaultPath: default_note_filename
                })
            }
            if (this_save_path === null){
                console.warn("No path is chosen to save.")
            } else {
                await NoteFileHandler.saveAsFile($viewState.editing_note, this_save_path)
            }
    
            if (!save_as_mode){
                $viewState.save_path = this_save_path
            }
            $Message.info("Saved")
        } catch (err) {
            console.error(err);
        }
    }
    
    static async openNote(){
        try {
            const { $viewState, $emitter } = useNuxtApp();

            const selected_open_path = await open({
                title: "Open",
                multiple: false,
                directory: false,
                filters: [
                    { name: "Note", extensions: [ struct_note_file_extension ] },
                ]
            })
    
            if (selected_open_path === null){
                console.warn("No path is chosen to open.")
                return
            } 
    
            // check if the selected open path is a String[]
            if (Array.isArray(selected_open_path)){
                console.warn("The selected open path is an array, which is not expected.")
                return
            }
    
            // selected_open_path === String
            $viewState.editing_note = await NoteFileHandler.loadFile(selected_open_path)
    
            // set default save path as the open path
            $viewState.save_path = selected_open_path
    
            // emit the open note event
            $emitter.emit(EventConstant.OPEN_NOTE)
        } catch (err) {
            console.error(err);
        }
    }
}