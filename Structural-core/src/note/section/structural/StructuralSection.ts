import { OrderedComponents } from "@/note/common"
import { NoteSection } from "@/note/section"
import { StructuralElement, StructureDefinition } from "@/note/section/structural"

/**
 * A note section that is
 * - has repeated elements
 * - the elements are based on the definition
 */
export class StructuralSection extends NoteSection {
    private _definition : StructureDefinition = new StructureDefinition()
    private _elements : OrderedComponents<StructuralElement> = new OrderedComponents()

    constructor(title: string){
        super(title)
    }

    get definition() : StructureDefinition {
        return this._definition
    }

    get elements() : OrderedComponents<StructuralElement> {
        return this._elements
    }
}