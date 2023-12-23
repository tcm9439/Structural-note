import { AppState } from "@/view/state/AppState.js"

export class AppException extends Error {
    constructor(message: string, name?: string) {
        super(message)
        this.name = name || "AppException"
        AppState.logger.warn(`${this.name}: ${message}`)
    }
}