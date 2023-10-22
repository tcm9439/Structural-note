import { ElementMarkdownConverter } from "@/converter/markdown/Element"
import { StringBuilder } from "@/converter/ConverterHelper"
import { NoteSection } from "@/note/section/NoteSection"

export class SectionMarkdownConverter{
    static convert(section: NoteSection): string {
        let result = new StringBuilder()
        result.appendLine("## " + section.title)
        section.elements.ordered_components.forEach((element) => {
            result.appendLine(ElementMarkdownConverter.convert(element)).appendHorizontalRow()
        })
        return result.removeLastRow().toString()
    }
}