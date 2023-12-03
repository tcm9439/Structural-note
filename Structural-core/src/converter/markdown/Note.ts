import { Converter } from "@/converter/Converter"
import { Note } from "@/note/Note"
import { SectionMarkdownConverter } from "@/converter/markdown/Section"
import { StringBuilder } from "@/converter/ConverterHelper"

/**
 * The "root" markdown converter for a note.
 */
export class NoteMarkdownConverter extends Converter<Note, string>{
    convert(note: Note): string {
        let result = new StringBuilder()
        result.appendLine("# " + note.title).appendEmptyLine()
        note.sections.ordered_components.forEach((section) => {
            result.appendLine(SectionMarkdownConverter.convert(section)).appendEmptyLine()
        })
        return result.toString()
    }
}