import { AppException } from "./AppException.js"
import { AppState } from "@/view/state/AppState.js"

export class InvalidJsonFormatException extends AppException {
    constructor(component: string, message: string) {
        super(`Fail to parse ${component} from json: ${message}`, 
            "InvalidJsonFormatException", 
            AppState.translationManager.translate("error.json.invalid_format.title"),
            AppState.translationManager.translate("error.json.invalid_format.message", null, [component]))
    }
}

export class InvalidDataException extends AppException {
    constructor(component: string, message: string) {
        super(`Fail to parse ${component} due to invalid data: ${message}`, 
            "InvalidDataException",
            AppState.translationManager.translate("error.json.invalid_data.title"),
            AppState.translationManager.translate("error.json.invalid_data.message", null, [component]))
    }
}