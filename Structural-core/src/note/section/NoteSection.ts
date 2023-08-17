import { ComponentBase, OrderedComponents } from "@/note/common"
import { NoteElement } from "@/note/element"

/**
 * A section of a note.
 */
export class NoteSection extends ComponentBase {
    private _title: string
    private _elements: OrderedComponents<NoteElement> = new OrderedComponents()

    constructor(title: string) {
        super()
        this._title = title
    }

    get title(): string {
        return this._title
    }

    get elements(): OrderedComponents<NoteElement> {
        return this._elements
    }
}