import { ComponentBase } from "@/note/util/ComponentBase"
import { OrderedComponents } from '@/note/util/OrderedComponents'
import { UUID } from "@/common/CommonTypes"
import { EditPathNode } from "@/note/util/EditPath"
import { NoteElement } from "@/note/element/NoteElement"

/**
 * A section of a note.
 */
export class NoteSection extends ComponentBase implements EditPathNode {
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

    getNextEditPathNode(index: UUID): EditPathNode | undefined {
        return this._elements.get(index)
    }
}