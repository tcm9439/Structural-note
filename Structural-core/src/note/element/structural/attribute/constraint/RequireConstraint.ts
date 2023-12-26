import { Constraint, ConstraintJson, ConstraintType } from "./Constraint.js"
import { OperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { z } from "zod"

export const RequireConstraintJson = ConstraintJson.extend({
    type: z.literal("RequireConstraint")
}).required()

export class RequireConstraint extends Constraint {
    static readonly type: ConstraintType = ConstraintType.REQUIRE

    getType(): ConstraintType {
        return RequireConstraint.type
    }

    /**
     * Rule:
     * 1. If the value is null or undefined, it is invalid
     * 2. If the value is a string, and it is empty, it is invalid
     */
    validate(value: any): OperationResult {
        let isEmpty = false
        if (value === null || value === undefined) {
            isEmpty = true
        }

        if (typeof value === "string" && value.trim() === "") {
            isEmpty = true
        }

        if (isEmpty) {
            return OperationResult.invalid("structural.attribute.constraint.error.attr_is_required")
        }

        return OperationResult.valid()
    }

    saveAsJson(): z.infer<typeof RequireConstraintJson> {
        return {
            id: this.id,
            type: "RequireConstraint"
        }
    }

    static loadFromJson(json: object): RequireConstraint {
        // check if the json_data match the schema
        const result = RequireConstraintJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("RequireConstraint", result.error.toString())
        }
        const valid_json = result.data
        let loaded_constraint = new RequireConstraint()
        loaded_constraint.id = valid_json.id
        return loaded_constraint
    }
}