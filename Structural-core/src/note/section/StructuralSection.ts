import { UUID } from "@/common/CommonTypes.js"
import { NoteElement, ElementType } from "@/note/element/NoteElement.js"
import { TextElement } from "@/note/element/TextElement.js"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath.js"
import { InvalidJsonFormatException, InvalidDataException } from "@/exception/ConversionException.js"
import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { StructureDefinition, StructureDefinitionJson } from "@/note/element/structural/StructureDefinition.js"
import { NoteSection, NoteSectionJson } from "./NoteSection.js"

import _ from "lodash"
import { z } from "zod"


export const StructuralSectionJson = NoteSectionJson.extend({
    type: z.literal("StructuralSection"),
    definition: StructureDefinitionJson
}).required()

/**
 * A note section that
 * - has repeated elements which are based on the definition
 * - has other elements
 */
export class StructuralSection extends NoteSection {
    public static readonly DEFINITION_FILTER_MODE: number = 0
    public static readonly ELEMENT_FILTER_MODE: number = 1

    private _definition : StructureDefinition = new StructureDefinition()

    constructor(title?: string){
        super(title)
        this.addAvailableElementType(ElementType.STRUCT)
    }

    private set definition(value: StructureDefinition) {
        this._definition = value
    }

    get definition() : StructureDefinition {
        return this._definition
    }

    updateDefinition(value: StructureDefinition){
        if (this.definition.id !== value.id){
            return
        }
        this.definition = value
    }

    getNextEditPathNode(index: UUID): EditPathNode | undefined {
        if (index === this._definition.id) return this._definition
        return this.elements.get(index)
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        if (filter_mode === undefined || filter_mode === StructuralSection.ELEMENT_FILTER_MODE) {
            return super.stepInEachChildren(edit_path)
        }

        if (filter_mode === StructuralSection.DEFINITION_FILTER_MODE) {
            return [edit_path.clone().append(this._definition.id, "definition", false)]
        }

        throw new EndOfEditPathError(`StructuralSection (mode ${filter_mode})`)
    }

    saveAsJson(): z.infer<typeof StructuralSectionJson> {
        let json_base = super.saveAsJson()
        json_base["type"] = "StructuralSection"
        _.set(json_base, "definition", this._definition.saveAsJson())
        return json_base as z.infer<typeof StructuralSectionJson>
    }

    static loadFromJson(json: object): NoteSection {
        let result = StructuralSectionJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("StructuralSection", result.error.toString())
        }
        const valid_json = result.data

        const section = new StructuralSection(valid_json.title)
        section.id = valid_json.id

        const def = StructureDefinition.loadFromJson(valid_json.definition)
        section.definition = def

        valid_json.elements.forEach((element_json) => {
            let element: NoteElement
            if (element_json.type === "TextElement") {
                element = TextElement.loadFromJson(element_json)
            } else if (element_json.type === "StructuralElement") {
                element = StructuralElement.loadFromJson(element_json, def)
            } else {
                throw new InvalidDataException("StructuralSection", `Unknown element type: ${element_json.type}`)
            }
            section.elements.add(element)
        })
        return section
    }
}