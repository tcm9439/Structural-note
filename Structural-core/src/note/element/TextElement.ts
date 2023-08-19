import { NoteElement } from "@/note/element/NoteElement"

/**
 * A note element that is 
 * - not repeated
 * - a text area (a string)
 */
export class TextElement extends NoteElement {
    private _content: string
    
	constructor(content?: string ) {
        super()
		this._content = content || ""
	}

    get content(): string {
        return this._content
    }

    set content(content: string) {
        this._content = content
    }
}