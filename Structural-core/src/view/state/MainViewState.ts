import { Note } from "@/note/Note"

export class MainViewState {
    private _editing_note: Note | null = null

    get editing_note_name(): string | null {
        return this._editing_note?.title ?? null
    }

    set editing_note(note: Note | null) {
        this._editing_note = note
    }

    get editing_note(): Note | null {
        return this._editing_note
    }
}