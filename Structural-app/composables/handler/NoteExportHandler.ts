import { ConverterType, AppState, UnimplementedException, NoteMarkdownConverter, Converter, Note, NoteTxtConverter } from "structural-core"
import { TauriFileSystem } from "@maisyt/tauri-fs-util"
import { save } from "@tauri-apps/api/dialog"
import { tran } from "~/composables/app/translate"

export type NoteConverterType = {
    converter: Converter<Note, string>,
    file_extension: string,
}

export class NoteExportHandler {
    private static async askForSavePath(export_file_extension: string, default_note_filename: string): Promise<string | null> {
        const save_path = await save({
            title: "Save",
            filters: [
                { name: "Export File Type", extensions: [ export_file_extension ] },
            ],
            defaultPath: default_note_filename
        })

        return save_path
    }

    static emitShowConvertPreviewEvent(type: ConverterType){
        const { $emitter } = useNuxtApp()
        $emitter.emit("EventConstant.EXPORT", type)
    }
    
    static getConverter(type: ConverterType): NoteConverterType {
        switch (type){
            case ConverterType.MARKDOWN:
                return {
                    converter: new NoteMarkdownConverter(),
                    file_extension: "md",
                }
            case ConverterType.TEXT:
                return {
                    converter: new NoteTxtConverter(),
                    file_extension: "txt",
                }
            default:
                throw new UnimplementedException(`export to type ${type}`)
        }
    }

    /**
     * Convert the Note to a some other file type.
     * Open a dialog for choosing a path to save the converted file.
     */
    static async exportToFile(converted_content: string, file_extension: string = 'txt',
                              cancel_callback: () => void = () => {},
                              complete_callback: () => void = () => {}){
        try {
            const { $viewState, $Message } = useNuxtApp()

            const selected_export_path = await this.askForSavePath(file_extension, $viewState.editing_note!.title)
            if (selected_export_path === null){
                AppState.logger.warn("No path is chosen to open.")
                $Message.info(tran("common.cancel"))
                cancel_callback()
                return
            }
            await TauriFileSystem.instance.writeTextFile(selected_export_path, converted_content, false, true)
            complete_callback()
            $Message.info(tran("common.saved"))
        } catch (err) {
            AppState.logger.error("Fail to export Note.", err)
            throw err
        }
    }
}