import { ElementTxtConverter } from "./Element.js"
import { StringBuilder } from "@/converter/ConverterHelper.js"
import { NoteSection } from "@/note/section/NoteSection.js"

export class SectionTxtConverter{
    static section_horizontal_row = "=================================================="
    static element_horizontal_row = "--------------------------------------------------"

    static convert(section: NoteSection): string {
        let converter = new ElementTxtConverter()
        let result = new StringBuilder()
        result.appendLine(section.title).appendLine(SectionTxtConverter.section_horizontal_row)
        section.elements.ordered_components.forEach((element) => {
            result.appendLine(converter.convert(element))
                .appendEmptyLine()
                .appendLine(SectionTxtConverter.element_horizontal_row)
        })
        return result.removeLastRow().removeLastRow().toString()
    }
}