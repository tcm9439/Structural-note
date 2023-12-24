import { AppException } from "./AppException.js"
import { AppState } from "@/view/state/AppState.js"

export class InvalidTypeConversionForDataException extends AppException {
    constructor(fromType: string, toType: string, data: any) {
        super(`Invalid operation: Cannot convert data "${data}" from type ${fromType} to type ${toType}`, 
              "InvalidTypeConversionForDataException",
              AppState.translationManager.translate("error.attribute.invalid_type_conversion.title"),
              AppState.translationManager.translate("error.attribute.invalid_type_conversion.message", null, [fromType, toType])
             )
    }
}

export class InvalidTypeConversionException extends AppException {
    constructor(fromType: string, toType: string, description?: string) {
        if (description === undefined) {
            description = ""
        } else {
            description = ` (${description})`
        }
        super(`Invalid operation: Cannot convert type ${fromType} to type ${toType}${description}`, 
              "InvalidTypeConversionException",
              AppState.translationManager.translate("error.attribute.invalid_type_conversion.title"),
              AppState.translationManager.translate("error.attribute.invalid_type_conversion.message", null, [fromType, toType])
             )
    }
}

export class NullAttrTypeException extends AppException {
    constructor() {
        super(`Invalid argument: Attribute Type cannot be null`, 
            "NullAttrTypeException",
            AppState.translationManager.translate("error.attribute.null_attr_type.title"),
            AppState.translationManager.translate("error.attribute.null_attr_type.message"))
    }
}


export class IncompatibleConstrain extends AppException {
    constructor(new_constrain_type: string, existing_constrain_type: string) {
        super(`Constrain ${new_constrain_type} not compatible to ${existing_constrain_type}`, 
            "IncompatibleConstrain",
            AppState.translationManager.translate("error.attribute.incompatible_constrain.title"),
            AppState.translationManager.translate("error.attribute.incompatible_constrain.message", null, [new_constrain_type, existing_constrain_type]))
    }
}

export class ForbiddenConstrain extends AppException {
    constructor(constrain_type: string) {
        super(`Constrain ${constrain_type} is not allowed for this attribute.`, 
            "ForbiddenConstrain",
            AppState.translationManager.translate("error.attribute.forbidden_constrain.title"),
            AppState.translationManager.translate("error.attribute.forbidden_constrain.message", null, [constrain_type]))
    }
}