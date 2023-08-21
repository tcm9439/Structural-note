import { ComponentBase } from "@/note/util/ComponentBase"
import { OrderedComponents } from "@/note/util/OrderedComponents"
import { EditPathNode, EditPath } from "@/note/util/EditPath"
import { NoteSection } from "@/note/section/NoteSection"

/**
 * One note in the notebook.
 * A note is a collection of sections.
 * 
 * Can be saved to a file.
 */
export class Note extends ComponentBase implements EditPathNode {
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

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return this._sections.get(index)
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        return this.sections.order.order.map((section_id) => {
            return edit_path.clone().append(section_id)
        })
    }
}
