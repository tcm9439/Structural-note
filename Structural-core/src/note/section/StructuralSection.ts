import { NoteSection } from "@/note/section"
import { StructureDefinition } from "@/note/element/structural"

/**
 * A note section that
 * - has repeated elements which are based on the definition
 * - has other elements
 */
export class StructuralSection extends NoteSection {
    private _definition : StructureDefinition = new StructureDefinition()

    constructor(title: string){
        super(title)
    }

    get definition() : StructureDefinition {
        return this._definition
    }
}