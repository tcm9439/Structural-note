import { AttributeValueCsvConverter } from "./AttributeValue.js"
import { NoteElement } from "@/note/element/NoteElement.js"
import { StructuralElement } from "@/note/element/structural/StructuralElement.js"

export class ElementCsvConverter {
    convert(element: NoteElement): string[] | null {
        if (element instanceof StructuralElement){
            return ElementCsvConverter.fromStruct(element)
        } else {
            return null
        }
    }
    
    static fromStruct(element: StructuralElement): any[] {
        let converter = new AttributeValueCsvConverter()
        let result: any[] = []
        element.definition.attributes.ordered_components.forEach((attr_def) => {
            let value = element.values.get(attr_def.id)
            if (value === undefined){
                result.push("")
            } else {
                let converted_value = converter.convert(attr_def, value)
                result.push(converted_value)
            }
        })
        return result
    }
}