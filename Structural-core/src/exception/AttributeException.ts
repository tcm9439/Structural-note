import { AppException } from "./AppException.js"

export class InvalidTypeConversionForDataException extends AppException {
    constructor(fromType: string, toType: string, data: any) {
        super(`Invalid operation: Cannot convert data "${data}" from type ${fromType} to type ${toType}`, "InvalidTypeConversionForDataException")
    }
}

export class InvalidTypeConversionException extends AppException {
    constructor(fromType: string, toType: string, description?: string) {
        if (description === undefined) {
            description = ""
        } else {
            description = ` (${description})`
        }
        super(`Invalid operation: Cannot convert type ${fromType} to type ${toType}${description}`, "InvalidTypeConversionException")
    }
}

export class NullAttrTypeException extends AppException {
    constructor() {
        super(`Invalid argument: Attribute Type cannot be null`, "NullAttrTypeException")
    }
}


export class IncompatibleConstrain extends AppException {
    constructor(new_constrain_type: string, existing_constrain_type: string) {
        super(`Constrain ${new_constrain_type} not compatible to ${existing_constrain_type}`, "IncompatibleConstrain")
    }
}

export class ForbiddenConstrain extends AppException {
    constructor(constrain_type: string) {
        super(`Constrain ${constrain_type} is not allowed for this attribute.`, "ForbiddenConstrain")
    }
}