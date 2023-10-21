import { ComponentBase } from "@/note/util/ComponentBase"
import { UUID } from "@/common/CommonTypes"
import { OrderedComponents, ComponentsOrderJson } from "@/note/util/OrderedComponents"
import { EditPathNode, EditPath } from "@/note/util/EditPath"
import { NoteSection, NoteSectionJson } from "@/note/section/NoteSection"
import { StructuralSection } from "@/note/section/StructuralSection"
import { z } from "zod"

export const NoteJson = z.object({
    id: z.string(),
    section_order: ComponentsOrderJson,
    sections: z.array(NoteSectionJson.passthrough())
}).required()

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

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return this._sections.get(index)
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        return this.sections.ordered_components.map((section) => {
            return edit_path.clone().append(section.id, section.title, true)
        })
    }

    saveAsJson(): z.infer<typeof NoteJson> {
        let sections = this.sections.ordered_components.flatMap((section) => {
            return section.saveAsJson()
        })

        return {
            id: this.id,
            section_order: this.sections.saveAsJson(),
            sections: sections
        }
    }

    static loadFromJson(title: string, json: object): Note | null {
        let result = NoteJson.safeParse(json)
        if (!result.success) {
            console.error(result.error)
            return null
        }
        const valid_json = result.data
        
        const note = new Note(title)
        note.id = valid_json.id
        
        // load sections
        let loaded_sections: Map<UUID, NoteSection> = new Map()
        valid_json.sections.forEach((section_json) => {
            let section: NoteSection | null
            if (section_json.type === "NoteSection") {
                section = NoteSection.loadFromJson(section_json)
            } else if (section_json.type === "StructuralSection") {
                section = StructuralSection.loadFromJson(section_json)
            } else {
                console.error(`Unknown section type: ${section_json.type}`)
                return null
            }

            if (section !== null) {
                loaded_sections.set(section.id, section)
            }
        })

        // add the loaded section in order
        let order = valid_json.section_order
        // forEach may not preserve order
        for (let i = 0; i < order.length; i++) {
            const section = loaded_sections.get(order[i])
            if (section === undefined) {
                return null
            }
            note.sections.add(section)
        }

        return note
    }
}
