import { ConverterType } from "@/converter/ConverterType"
import { NoteConverter } from "./Converter"
import { NoteMarkdownConverter } from "@/converter/markdown/Note"
import { NoteTxtConverter } from "@/converter/txt/Note"
import { NoteCsvConverter, NoteExcelConverter } from "@/converter/csv/Note"
import { UnimplementedException } from "@/exception/AppException"

export class ConverterFactory {
    static getConverter(type: ConverterType): NoteConverter {
        switch (type) {
            case ConverterType.MARKDOWN:
                return new NoteMarkdownConverter()
            case ConverterType.TEXT:
                return new NoteTxtConverter()
            case ConverterType.CSV:
                return new NoteCsvConverter()
            case ConverterType.EXCEL:
                return new NoteExcelConverter()
            default:
                throw new UnimplementedException(`export to type ${type}`)
        }
    }
}
