import { Note } from "@/note/Note.js"
import { Converter } from "../Converter.js"
import { SectionTxtConverter } from "./Section.js"
import { StringBuilder } from "../ConverterHelper.js"

/**
 * The "root" txt converter for a note.
 */
export class NoteTxtConverter extends Converter<Note, string>{
    static note_title_horizontal_row = "##################################################"

    convert(note: Note): string {
        let result = new StringBuilder()
        result.appendLine(NoteTxtConverter.note_title_horizontal_row)
            .appendLine(note.title)
            .appendLine(NoteTxtConverter.note_title_horizontal_row)
            .appendEmptyLine()
        note.sections.ordered_components.forEach((section) => {
            result.appendLine(SectionTxtConverter.convert(section)).appendEmptyLine()
        })
        return result.toString()
    }
}