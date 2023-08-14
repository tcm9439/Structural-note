import { NoteSection } from "@/note/section"

/**
 * A note section that is 
 * - not repeated
 * - a text area (a string)
 */
export class TextAreaSection extends NoteSection {
    private _content: string = ""
    constructor(title: string){
        super(title)
    }

    get content(): string {
        return this._content
    }

    set content(content: string) {
        this._content = content
    }
}