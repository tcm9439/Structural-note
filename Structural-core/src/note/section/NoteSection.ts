import { ComponentBase } from "@/note/common/ComponentBase"
import { NoteElement } from "@/note/element/NoteElement"
import { OrderedComponents } from '@/note/common/OrderedComponents';

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