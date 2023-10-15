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

export class NullAttrTypeException extends Error {
    constructor() {
        super(`Invalid argument: Attribute Type cannot be null`)
        this.name = 'NullAttrTypeException'
    }
}


export class IncompatibleConstrain extends Error {
    constructor(new_constrain_type: string, existing_constrain_type: string) {
        super(`Constrain ${new_constrain_type} not compatible to ${existing_constrain_type}`)
        this.name = 'IncompatibleConstrain'
    }
}

export class ForbiddenConstrain extends Error {
    constructor(constrain_type: string) {
        super(`Constrain ${constrain_type} is not allowed for this attribute.`)
        this.name = 'ForbiddenConstrain'
    }
}