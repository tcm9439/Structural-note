import { UUID } from "@/common/CommonTypes"
import { AttributeValue, StructureDefinition } from "@/note/element/structural"
import { NoteElement } from "@/note/element"
/**
 * A structural element is a part of a structural section.
 * Repeated components.
 */
export class StructuralElement extends NoteElement {
    /** 
     * attribute UUID => value 
     **/
    private _values: Map<UUID, AttributeValue<any>> = new Map()

    constructor(){
        super()
    }

    get values(): Map<UUID, AttributeValue<any>> {
        return this._values
    }

    /**
     * Validate the element according to the definition
     * @returns true if the element is valid
     */
    validate(definition: StructureDefinition): boolean {
        // TODO
        return true
    }
}