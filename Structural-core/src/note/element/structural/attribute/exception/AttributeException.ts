export class InvalidTypeConversionForDataException extends Error {
    constructor(fromType: string, toType: string, data: any) {
        super(`Invalid operation: Cannot convert data "${data}" from type ${fromType} to type ${toType}`)
        this.name = 'InvalidTypeConversionForDataException'
    }
}

export class InvalidTypeConversionException extends Error {
    constructor(fromType: string, toType: string, description?: string) {
        if (description === undefined) {
            description = ""
        } else {
            description = ` (${description})`
        }
        super(`Invalid operation: Cannot convert type ${fromType} to type ${toType}${description}`)
        this.name = 'InvalidTypeConversionException'
    }
}
