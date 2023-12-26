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


export class IncompatibleConstraint extends AppException {
    constructor(new_constraint_type: string, existing_constraint_type: string) {
        super(`Constraint ${new_constraint_type} not compatible to ${existing_constraint_type}`, 
            "IncompatibleConstraint",
            AppState.translationManager.translate("error.attribute.incompatible_constraint.title"),
            AppState.translationManager.translate("error.attribute.incompatible_constraint.message", null, [new_constraint_type, existing_constraint_type]))
    }
}

export class ForbiddenConstraint extends AppException {
    constructor(constraint_type: string) {
        super(`Constraint ${constraint_type} is not allowed for this attribute.`, 
            "ForbiddenConstraint",
            AppState.translationManager.translate("error.attribute.forbidden_constraint.title"),
            AppState.translationManager.translate("error.attribute.forbidden_constraint.message", null, [constraint_type]))
    }
}