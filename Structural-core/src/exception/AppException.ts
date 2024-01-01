import { LoggerManager } from "@/common/Logger.js"
import { AppState } from "@/view/state/AppState.js"

export class AppException extends Error {
    public title_key: string = "error.general.title"
    public message_key: string = "error.general.message"
    
    constructor(log_message: string, name?: string, title_key?: string, message_key?: string) {
        super(log_message)
        this.name = name || "AppException"
        LoggerManager.logger.warn(`${this.name}: ${log_message}`)
        this.title_key = title_key || this.title_key
        this.message_key = message_key || this.message_key
    }
}

export class UnimplementedException extends AppException {
    constructor(operation: string) {
        super(`Invalid operation: Function not implemented / unsupported operation.`, 
            "UnimplementedException",
            AppState.translationManager.translate("error.common.unsupported.title"),
            AppState.translationManager.translate("error.common.unsupported.message", null, [operation]))
    }
}