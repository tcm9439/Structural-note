import { AppState } from "@/view/state/AppState.js"

export class AppException extends Error {
    private title_key: string = "error.general.title"
    private message_key: string = "error.general.message"
    
    constructor(log_message: string, name?: string, title_key?: string, message_key?: string) {
        super(log_message)
        this.name = name || "AppException"
        AppState.logger.warn(`${this.name}: ${log_message}`)
        this.title_key = title_key || this.title_key
        this.message_key = message_key || this.message_key
    }
}