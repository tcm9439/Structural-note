type LogOptions = {
    file?: string;
    line?: number;
    keyValues?: Record<string, string | undefined>;
}

type LoggerModule = {
    error(message: string, options?: LogOptions): Promise<void>
    warn(message: string, options?: LogOptions): Promise<void>
    info(message: string, options?: LogOptions): Promise<void>
    debug(message: string, options?: LogOptions): Promise<void>
    trace(message: string, options?: LogOptions): Promise<void>
    attachConsole(): Promise<any>
}

export class Logger {
    private static module: LoggerModule
    private static detached_function: any
    private static instance: Logger

    private constructor() {}

    static async initLogger(){
        if (!this.instance) {
            this.instance = new Logger()
            this.module = await import("tauri-plugin-log-api")
            this.detached_function = await this.module.attachConsole()
        }
    }

    static async error(message: string) {
        await this.module.error(message)
    }

    static async warn(message: string) {
        await this.module.warn(message)
    }

    static async info(message: string) {
        await this.module.info(message)
    }

    static async debug(message: string) {
        await this.module.debug(message)
    }

    static async trace(message: string) {
        await this.module.trace(message)
    }

    static async close(){
        this.detached_function()
    }
}