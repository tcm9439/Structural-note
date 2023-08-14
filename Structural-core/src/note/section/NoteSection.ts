import { ComponentBase } from "@/note/common"

/**
 * A section of a note.
 */
export abstract class NoteSection extends ComponentBase {
    private _title: string

    constructor(title: string) {
        super()
        this._title = title
    }

    get title(): string {
        return this._title
    }
}