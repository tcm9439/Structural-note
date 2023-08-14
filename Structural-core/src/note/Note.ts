import { ComponentBase, OrderedComponents } from "@/note/common"
import { NoteSection } from "@/note/section"

/**
 * One note in the notebook.
 * A note is a collection of sections.
 * 
 * Can be saved to a file.
 */
export class Note extends ComponentBase {
    private _title: string
    private _sections: OrderedComponents<NoteSection> = new OrderedComponents()

    constructor(title: string) {
        super()
        this._title = title
    }

    get title(): string {
        return this._title
    }

    set title(title: string) {
        this._title = title
    }

    get sections(): OrderedComponents<NoteSection> {
        return this._sections
    }

    save(){
        // TODO
    }
}
