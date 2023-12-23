export type LogOptions = {
    file?: string;
    line?: number;
    keyValues?: Record<string, string | undefined>;
}

export type LoggerModule = {
    error(message: string, options?: LogOptions): Promise<void>
    warn(message: string, options?: LogOptions): Promise<void>
    info(message: string, options?: LogOptions): Promise<void>
    debug(message: string, options?: LogOptions): Promise<void>
    trace(message: string, options?: LogOptions): Promise<void>
    attachConsole(): Promise<any>
}

export abstract class Logger {
    protected static instance: Logger
    public static get(): Logger {
        if (!Logger.instance) {
            WebLogger.initLogger()
        }
        return Logger.instance
    }

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

    static async initLogger(){
        if (!Logger.instance) {
            Logger.instance = new WebLogger()
        }
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
    private static module: LoggerModule
    private static detached_function: any

    private constructor() {
        super()
    }

    static async initLogger(){
        if (!Logger.instance) {
            Logger.instance = new TauriLogger()
            this.module = await import("tauri-plugin-log-api")
            this.detached_function = await this.module.attachConsole()
        }
    }

    static getInstance(): TauriLogger {
        return this.instance
    }

    async error(message: string) {
        await TauriLogger.module.error(message)
    }

    async warn(message: string) {
        await TauriLogger.module.warn(message)
    }

    async info(message: string) {
        await TauriLogger.module.info(message)
    }

    async debug(message: string) {
        await TauriLogger.module.debug(message)
    }

    async trace(message: string) {
        await TauriLogger.module.trace(message)
    }

    async close(){
        await TauriLogger.detached_function()
    }
}