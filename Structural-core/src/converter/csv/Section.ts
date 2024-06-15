import { StructuralSection } from "@/note/section/StructuralSection.js"
import { ElementCsvConverter } from "./Element.js"
import { NoteSection } from "@/note/section/NoteSection.js"

export type WorkBookCol = {
    name: string
}

export type SectionCsvData = {
    sheetName: string,
    columns: WorkBookCol[]
    data: any[][]
}

export class SectionCsvConverter{
    static convert(section: NoteSection): SectionCsvData | null {
        if (section instanceof StructuralSection){
            let converter = new ElementCsvConverter()
            let data: string[][] = []
            section.elements.ordered_components.forEach((element) => {
                let row = converter.convert(element)
                if (row) {
                    data.push(row)
                }
            })
    
            let structSection = section as StructuralSection
            let columns: WorkBookCol[] = structSection.definition.attributes.ordered_components.map(attr => {
                return {
                    name: attr.name
                }
            })
            
            return {
                sheetName: section.title,
                columns,
                data,
            }
        } else {
            return null
        }
    }
}