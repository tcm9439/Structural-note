import { ConverterType } from "@/converter/ConverterType"
import { UnimplementedException } from "@/exception/AppException"
import { Note } from "@/note/Note"
import { TauriFileSystem } from "@maisyt/tauri-fs-util"

/**
 * An class that accept an element of type E and convert it to a result of type R.
 */

export abstract class Converter<E, R> {
    abstract convert(element: E): R;
}

export type CsvConvertedResult = Promise<Map<string, Uint8Array>>
export type ExcelConvertedResult = Promise<Uint8Array>
export type NoteConvertedResult = string | ExcelConvertedResult | CsvConvertedResult
export type NoteConverter = Converter<Note, NoteConvertedResult>

export type SaveType = {
    multipleFiles: boolean,
    extension: string,
}
