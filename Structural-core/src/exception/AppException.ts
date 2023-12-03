import { Logger } from "@/common/Logger"

export class AppException extends Error {
    constructor(message: string, name?: string) {
        super(message)
        this.name = name || "AppException"
        Logger.get().warn(`${this.name}: ${message}`)
    }
}