export class NullVariableException extends Error {
    constructor(variable: string, object?: string) {
        if (object === undefined) {
            super(`Variable ${variable} cannot be null`)
        } else {
            super(`Variable ${variable} of ${object} cannot be null`)
        }
        this.name = 'NullVariableException'
    }
}