import { Note } from "@/note/Note.js"
import { Converter, CsvConvertedResult, ExcelConvertedResult } from "../Converter.js"
import { SectionCsvConverter } from "./Section.js"
import { Workbook } from "exceljs"

function noteToWorkbook(note: Note): Workbook {
    const workbook = new Workbook()

    note.sections.ordered_components.forEach((section) => {
        let sectionData = SectionCsvConverter.convert(section)
        if (sectionData){
            let worksheet = workbook.addWorksheet(sectionData.sheetName)
            
            worksheet.addTable({
                name: sectionData.sheetName,
                ref: 'A1',
                headerRow: true,
                totalsRow: false,
                style: {
                    theme: 'TableStyleMedium4',
                    showRowStripes: true,
                },
                columns: sectionData.columns,
                rows: sectionData.data,
            })
        }
    })

    return workbook
}

export class NoteCsvConverter extends Converter<Note, CsvConvertedResult>{
    async convert(note: Note): CsvConvertedResult {
        let workbook = noteToWorkbook(note)
        let resultPromiseArray = workbook.worksheets.map(async worksheet => {
            let buffer = await workbook.csv.writeBuffer({
                sheetId: worksheet.id
            })
            return { 
                name: worksheet.name,
                binary: new Uint8Array(buffer) 
            }
        })

        return await Promise.all(resultPromiseArray).then((results) => {
            let result = new Map<string, Uint8Array>()
            results.forEach((worksheet) => {
                result.set(worksheet.name, worksheet.binary)
            })
            return result
        })
    }
}

export class NoteExcelConverter extends Converter<Note, ExcelConvertedResult>{
    async convert(note: Note): ExcelConvertedResult {
        let workbook = noteToWorkbook(note)
        const buffer = await workbook.xlsx.writeBuffer()
        return new Uint8Array(buffer)
    }
}