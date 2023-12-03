import { AppException } from "@/exception/AppException"

export class InvalidJsonFormatException extends AppException {
    constructor(component: string, message: string) {
        super(`Fail to parse ${component} from json: ${message}`, "InvalidJsonFormatException")
    }
}

export class InvalidDataException extends AppException {
    constructor(component: string, message: string) {
        super(`Fail to parse ${component} due to invalid data: ${message}`, "InvalidDataException")
    }
}