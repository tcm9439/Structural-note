import { TauriFileSystem } from "tauri-fs-util"
import { Note } from "structural-core"

export class NoteFileHandler {
    static loadFile(filename: string): Promise<Note> {
        return new Promise<Note>(async (resolve, reject) => {
            try {
                let content: string = await TauriFileSystem.instance.readTextFile(filename)
                let content_json = JSON.parse(content)
                let loaded_note = Note.loadFromJson(content_json)
                
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

    static saveAsFile(note: Note, filename: string): Promise<void> {
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
}