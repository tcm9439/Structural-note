import { Note } from "@/note/Note.js"
import { Converter } from "../Converter.js"
import { SectionMarkdownConverter } from "./Section.js"
import { StringBuilder } from "../ConverterHelper.js"

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