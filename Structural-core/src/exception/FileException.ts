import { AppException } from "@/exception/AppException"

/**
 * - FileAlreadyOpened
 * - InvalidFilePath
 * - FileIO
 */

export class FileIOException extends AppException {
    constructor(message: string) {
        super(message, "FileIOException")
    }
}

export class FileAlreadyOpened extends AppException {
    constructor(path: string) {
        super(`File "${path}" is already opened.`, "FileAlreadyOpened")
    }
}

export class InvalidFilePath extends AppException {
    constructor(message: string) {
        super(message, "InvalidFilePath")
    }
}