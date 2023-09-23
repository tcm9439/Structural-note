import { ComponentBase } from "@/note/util/ComponentBase"
import { OrderedComponents } from '@/note/util/OrderedComponents'
import { UUID } from "@/common/CommonTypes"
import { EditPathNode, EditPath } from "@/note/util/EditPath"
import { NoteElement, NoteElementJson } from "@/note/element/NoteElement"
import { TextElement } from "@/note/element/TextElement"
import { z } from "zod"

export const NoteSectionJson = z.object({
    type: z.string(),
    id: z.string(),
    title: z.string(),
    // passthrough : won't filter out child's class properties which don't exist in the parent class
    elements: z.array(NoteElementJson.passthrough())
}).required()

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

    set title(title: string) {
        this._title = title
    }

    get elements(): OrderedComponents<NoteElement> {
        return this._elements
    }

    getNextEditPathNode(index: UUID): EditPathNode | undefined {
        return this._elements.get(index)
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        return this.elements.ordered_components.map((element) => {
            return edit_path.clone().append(element.id, "element", false)
        })
    }

    saveAsJson(): z.infer<typeof NoteSectionJson> {
        let elements = this.elements.ordered_components.flatMap((element) => {
            return element.saveAsJson()
        })

        return {
            type: "NoteSection",
            id: this.id,
            title: this.title,
            elements: elements
        }
    }

    static loadFromJson(json: object): NoteSection | null {
        let result = NoteSectionJson.safeParse(json)
        if (!result.success) {
            console.error(result.error)
            return null
        }
        const valid_json = result.data
        const section = new NoteSection(valid_json.title)
        section.id = valid_json.id
        valid_json.elements.forEach((element_json) => {
            let element: NoteElement | null
            if (element_json.type === "TextElement") {
                element = TextElement.loadFromJson(element_json)
            } else {
                console.error(`Unknown element type: ${element_json.type}`)
                return null
            }

            if (element !== null) {
                section.elements.add(element)
            }
        })
        return section
    }
}
