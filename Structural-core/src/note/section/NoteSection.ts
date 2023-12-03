import { ComponentBase } from "@/note/util/ComponentBase"
import { OrderedComponents, ComponentsOrderJson } from '@/note/util/OrderedComponents'
import { UUID } from "@/common/CommonTypes"
import { EditPathNode, EditPath } from "@/note/util/EditPath"
import { NoteElement, NoteElementJson, ElementType } from "@/note/element/NoteElement"
import { TextElement } from "@/note/element/TextElement"
import { MarkdownElement } from "@/note/element/MarkdownElement"
import { z } from "zod"
import { InvalidJsonFormatException, InvalidDataException } from "@/exception/ConversionException"

export enum SectionType {
    BASE = "BASE",
    STRUCT = "STRUCT",
}

export const NoteSectionJson = z.object({
    type: z.string(),
    id: z.string(),
    title: z.string(),
    elements_order: ComponentsOrderJson,
    // passthrough : won't filter out child's class properties which don't exist in the parent class
    elements: z.array(NoteElementJson.passthrough())
}).required()

/**
 * A section of a note.
 */
export class NoteSection extends ComponentBase implements EditPathNode {
    private _title: string
    private _elements: OrderedComponents<NoteElement> = new OrderedComponents()
    private _available_element_types: ElementType[] = [
        ElementType.TEXT,
        ElementType.MARKDOWN
    ]

    constructor(title?: string){
        super()
        this._title = title ?? ""
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

    get available_element_types(): ElementType[] {
        return this._available_element_types
    }

    protected addAvailableElementType(type: ElementType) {
        this._available_element_types.push(type)
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
            elements_order: this.elements.saveAsJson(),
            elements: elements
        }
    }

    static loadFromJson(json: object): NoteSection {
        let result = NoteSectionJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("NoteSection", result.error.toString())
        }
        const valid_json = result.data
        const section = new NoteSection(valid_json.title)
        section.id = valid_json.id

        let loaded_elements: Map<UUID, NoteElement> = new Map()
        valid_json.elements.forEach((element_json) => {
            let element: NoteElement
            if (element_json.type === "TextElement") {
                element = TextElement.loadFromJson(element_json)
            } else if (element_json.type === "MdElement") {
                element = MarkdownElement.loadFromJson(element_json)
            } else {
                throw new InvalidDataException("NoteSection", `Unknown element type: ${element_json.type}`)
            }

            loaded_elements.set(element.id, element)
        })

        // add elements in order
        for (let i = 0; i < valid_json.elements_order.length; i++) {
            let element_id = valid_json.elements_order[i]
            let element = loaded_elements.get(element_id)
            if (element === undefined) {
                throw new InvalidDataException("NoteSection", `Element not found. ID: ${element_id}`)
            }
            section.elements.add(element)
        }

        return section
    }
}
