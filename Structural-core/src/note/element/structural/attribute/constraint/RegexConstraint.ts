import { Constraint, ConstraintType, ConstraintJson } from "./Constraint.js"
import { OperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { LoggerManager } from "@/common/Logger.js"
import { z } from "zod"

export const RegexConstraintJson = ConstraintJson.extend({
    type: z.literal("RegexConstraint"),
    pattern: z.string(),
}).required()

export class RegexConstraint extends Constraint {
    static readonly type: ConstraintType = ConstraintType.REGEX
    private _pattern: string = ".*"
    private _regex: RegExp = /^.*$/

    constructor(pattern: string = ".*") {
        super()
        this.pattern = pattern
    }

    set pattern(pattern: string) {
        try {
            this._pattern = pattern
            this._regex = new RegExp("^" + pattern + "$")
            this._validate_constraint_result = OperationResult.valid()
        } catch (e) {
            LoggerManager.logger.info(`RegexConstraint: invalid pattern: ${pattern} | ${e}`)
            this._regex = /^.*$/
            this._validate_constraint_result = OperationResult.invalid("structural.attribute.constraint.error.invalid_regex")
        }
    }

    get pattern(): string {
        return this._pattern
    }

    isConstraintValid(): OperationResult {
        return this.validate_constraint_result
    }

    getType(): ConstraintType {
        return RegexConstraint.type
    }

    validate(value: string): OperationResult {
        if (this._regex.test(value.trim())){
            return OperationResult.valid()
        } else {
            return OperationResult.invalid("structural.attribute.constraint.error.val_not_match_regex")
        }
    }
    
    saveAsJson(): z.infer<typeof RegexConstraintJson> {
        return {
            id: this.id,
            type: "RegexConstraint",
            pattern: this.pattern,
        }
    }

    static loadFromJson(json: object): RegexConstraint {
        // check if the json_data match the schema
        const result = RegexConstraintJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("RegexConstraint", result.error.toString())
        }
        const valid_json = result.data

        const constraint = new RegexConstraint(valid_json.pattern)
        constraint.id = valid_json.id
        return constraint
    }
}
