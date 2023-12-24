import { AppException } from "./AppException.js"
import { AppState } from "@/view/state/AppState.js"

/**
 * - FileAlreadyOpened
 * - InvalidFilePath
 * - FileIO
 */

export class FileIOException extends AppException {
    constructor(message: string) {
        super(message, "FileIOException", 
            AppState.translationManager.translate("error.file.io.title"), 
            AppState.translationManager.translate("error.file.io.message"))
    }
}

export class FileAlreadyOpened extends AppException {
    constructor(path: string) {
        super(`File "${path}" is already opened.`, "FileAlreadyOpened", 
            AppState.translationManager.translate("error.file.already_opened.title"),
            AppState.translationManager.translate("error.file.already_opened.message", null, [path]))
    }
}

export class InvalidFilePath extends AppException {
    constructor(message: string) {
        super(message, "InvalidFilePath", 
            AppState.translationManager.translate("error.file.invalid_path.title"), 
            AppState.translationManager.translate("error.file.invalid_path.message"))
    }
}