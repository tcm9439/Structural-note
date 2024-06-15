import { TauriFileSystem } from "@maisyt/tauri-fs-util"
import { ConverterType, AppState, Converter, Note, NoteExportHelper, UnimplementedException, type SaveType } from "@structural-note/structural-core"
import { open, save } from "@tauri-apps/api/dialog"
import { tran } from "~/composables/app/translate"

export type NoteConverterType = {
    converter: Converter<Note, string>,
    file_extension: string,
}

export class NoteExportHandler {
    private static async askForSavePath(isDirectory: boolean, file_extension: string, default_note_filename: string): Promise<string | null> {
        if (isDirectory){
            return await open({
                directory: isDirectory,
                multiple: false,
            }) as unknown as Promise<string | null> // ignore Promise<string[]>
        } else {
            const save_path = await save({
                filters: [
                    { name: "Export File Type", extensions: [file_extension]}
                ],
                defaultPath: default_note_filename,
            })

            return save_path
        }
    }

    static emitShowConvertPreviewEvent(type: ConverterType){
        const { $emitter } = useNuxtApp()
        $emitter.emit("EventConstant.EXPORT", type)
    }

    static async saveToFile(convertedValue: any, file_extension: string, path: string) {
        if (typeof convertedValue === 'string') {
            await TauriFileSystem.instance.writeTextFile(path, convertedValue, false, true)
        } else if (convertedValue instanceof Promise) {
            let newConvertedValue = await convertedValue
            if (newConvertedValue instanceof Map) {
                for (let [name, binary] of newConvertedValue) {
                    const pathname = `${path}/${name}.${file_extension}`
                    await TauriFileSystem.instance.writeBinaryFile(pathname, binary, true)
                } 
            } else if (newConvertedValue instanceof Uint8Array) {
                await TauriFileSystem.instance.writeBinaryFile(path, newConvertedValue, true)
            }
        }
    }

    static getSaveType(type: ConverterType): SaveType {
        switch (type) {
            case ConverterType.MARKDOWN:
                return {
                    multipleFiles: false,
                    extension: 'md',
                }
            case ConverterType.TEXT:
                return {
                    multipleFiles: false,
                    extension: 'txt',
                }
            case ConverterType.CSV:
                return {
                    multipleFiles: true,
                    extension: 'csv',
                }
            case ConverterType.EXCEL:
                return {
                    multipleFiles: false,
                    extension: 'xlsx',
                }
            default:
                throw new UnimplementedException(`export to type ${type}`)
        }
    }

    /**
     * Convert the Note to a some other file type.
     * Open a dialog for choosing a path to save the converted file.
     */
    static async exportToFile(type: ConverterType, converted_content: any,
                              cancel_callback: () => void = () => {},
                              complete_callback: () => void = () => {}){
        try {
            const { $viewState, $Message } = useNuxtApp()
            const saveType = NoteExportHandler.getSaveType(type)

            const selected_export_path = await this.askForSavePath(saveType.multipleFiles, saveType.extension, $viewState.editing_note!.title)
            if (selected_export_path === null){
                AppState.logger.warn("No path is chosen to open.")
                $Message.info(tran("common.cancel"))
                cancel_callback()
                return
            }
            await NoteExportHandler.saveToFile(converted_content, saveType.extension, selected_export_path)
            complete_callback()
            $Message.info(tran("common.saved"))
        } catch (err) {
            AppState.logger.error("Fail to export Note.", err)
            throw err
        }
    }
}