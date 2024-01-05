import { LogOptions, trace, debug, info, warn, error, attachConsole } from "tauri-plugin-log-api"

export abstract class Logger {
    abstract error(message: string, error_obj?: any, options?: LogOptions): void
    abstract warn(message: string, options?: LogOptions): void
    abstract info(message: string, options?: LogOptions): void
    abstract debug(message: string, options?: LogOptions): void
    abstract trace(message: string, options?: LogOptions): void
    abstract close(): Promise<void>
}

/**
 * A logger implementation for the web (Nuxt only env). 
 */
export class WebLogger extends Logger {
    private constructor() {
        super()
    }

    static initLogger(): WebLogger{
        return new WebLogger()
    }

    error(message: string, error_obj?: any, options?: LogOptions){
        console.error(message, error_obj)
    }

    warn(message: string, options?: LogOptions){
        console.warn(message)
    }

    info(message: string, options?: LogOptions){
        console.info(message)
    }

    debug(message: string, options?: LogOptions){
        console.debug(message)
    }

    trace(message: string, options?: LogOptions){
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

    error(message: string, error_obj?: any, options?: LogOptions) {
        if (error_obj === undefined) {
            error(message, options)
        } else {
            error(`${message} \n${error_obj}`, options)
        }
    }

    warn(message: string, options?: LogOptions) {
        warn(message, options)
    }

    info(message: string, options?: LogOptions) {
        info(message, options)
    }

    debug(message: string, options?: LogOptions) {
        debug(message, options)
    }

    trace(message: string, options?: LogOptions) {
        trace(message, options)
    }

    async close(){
        await TauriLogger.detached_function()
    }
}

export class LoggerManager {
    public static logger: Logger = WebLogger.initLogger()
}