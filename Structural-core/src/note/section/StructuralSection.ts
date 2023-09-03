import { UUID } from "@/common/CommonTypes"
import { NoteSection } from "@/note/section/NoteSection"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"

/**
 * A note section that
 * - has repeated elements which are based on the definition
 * - has other elements
 */
export class StructuralSection extends NoteSection {
    public static readonly DEFINITION_FILTER_MODE: number = 0
    public static readonly ELEMENT_FILTER_MODE: number = 1

    private _definition : StructureDefinition = new StructureDefinition()

    constructor(title: string){
        super(title)
    }

    get definition() : StructureDefinition {
        return this._definition
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

        throw new EndOfEditPathError(`StructuralSection (mode {filter_mode})`)
    }
}