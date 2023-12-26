import { Constraint, ConstraintJson, ConstraintType } from "./Constraint.js"
import { OperationResult, ValidOperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { z } from "zod"

export const RequireConstraintJson = ConstraintJson.extend({
    type: z.literal("RequireConstraint"),
    required: z.boolean()
}).required()

export class RequireConstraint extends Constraint {
    static readonly type: ConstraintType = ConstraintType.REQUIRE
    private _required: boolean

    constructor(required: boolean = true) {
        super()
        this._required = required
    }

    get required(): boolean {
        return this._required
    }

    set required(required: boolean) {
        this._required = required
    }

    getType(): ConstraintType {
        return RequireConstraint.type
    }
    
    constraintIsValid(): OperationResult {
        // This constraint is always valid
        return ValidOperationResult
    }

    /**
     * Rule:
     * 1. If the value is null or undefined, it is invalid
     * 2. If the value is a string, and it is empty, it is invalid
     */
    validate(value: any): OperationResult {
        if (!this._required) {
            return ValidOperationResult;
        }

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

        return ValidOperationResult;
    }

    saveAsJson(): z.infer<typeof RequireConstraintJson> {
        return {
            id: this.id,
            type: "RequireConstraint",
            required: this._required
        }
    }

    static loadFromJson(json: object): RequireConstraint {
        // check if the json_data match the schema
        const result = RequireConstraintJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("RequireConstraint", result.error.toString())
        }
        const valid_json = result.data

        let loaded_constraint = new RequireConstraint(valid_json.required)
        loaded_constraint.id = valid_json.id
        return loaded_constraint
    }
}