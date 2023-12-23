import { Note } from "@/note/Note.js"

export class MainViewState {
    private _editing_note: Note | null = null
    private _save_path: string | null = null

    get editing_note_name(): string {
        return this._editing_note?.title ?? "Untitled"
    }

    set editing_note(note: Note | null) {
        this._editing_note = note
    }

    get editing_note(): Note | null {
        return this._editing_note
    }

    get save_path(): string | null {
        return this._save_path
    }

    set save_path(path: string | null) {
        this._save_path = path
    }
}