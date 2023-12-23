import { LogOptions, trace, debug, info, warn, error, attachConsole } from "tauri-plugin-log-api"

export abstract class Logger {
    abstract error(message: string, options?: LogOptions): Promise<void>
    abstract warn(message: string, options?: LogOptions): Promise<void>
    abstract info(message: string, options?: LogOptions): Promise<void>
    abstract debug(message: string, options?: LogOptions): Promise<void>
    abstract trace(message: string, options?: LogOptions): Promise<void>
    abstract close(): Promise<void>
}

/**
 * A logger implementation for the web (Nuxt only env). 
 */
export class WebLogger extends Logger {
    private constructor() {
        super()
    }

    static async initLogger(): Promise<WebLogger>{
        return new WebLogger()
    }

    async error(message: string, options?: LogOptions): Promise<void> {
        console.error(message)
    }

    async warn(message: string, options?: LogOptions): Promise<void> {
        console.warn(message)
    }

    async info(message: string, options?: LogOptions): Promise<void> {
        console.info(message)
    }

    async debug(message: string, options?: LogOptions): Promise<void> {
        console.debug(message)
    }

    async trace(message: string, options?: LogOptions): Promise<void> {
        console.trace(message)
    }

    async close(): Promise<void> {
        // Nothing to do here
    }
}

/**
 * A wrapper class for the tauri-plugin-log-api.
 * As I need to import that module dynamically due to error related to type: "module"
 */
export class TauriLogger extends Logger {
    private static detached_function: any

    private constructor() {
        super()
    }

    static async initLogger(){
        this.detached_function = await attachConsole()
        return new TauriLogger()
    }

    async error(message: string) {
        await error(message)
    }

    async warn(message: string) {
        await warn(message)
    }

    async info(message: string) {
        await info(message)
    }

    async debug(message: string) {
        await debug(message)
    }

    async trace(message: string) {
        await trace(message)
    }

    async close(){
        await TauriLogger.detached_function()
    }
}