import { ElementMarkdownConverter } from "./Element.js"
import { StringBuilder } from "@/converter/ConverterHelper.js"
import { NoteSection } from "@/note/section/NoteSection.js"

export class SectionMarkdownConverter{
    static convert(section: NoteSection): string {
        let converter = new ElementMarkdownConverter()
        let result = new StringBuilder()
        result.appendLine("## " + section.title)
        section.elements.ordered_components.forEach((element) => {
            result.appendLine(converter.convert(element)).appendHorizontalRow()
        })
        return result.removeLastRow().toString()
    }
}