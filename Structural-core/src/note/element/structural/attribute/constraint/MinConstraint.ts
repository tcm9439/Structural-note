import { Constraint, ConstraintType, ConstraintJson } from "./Constraint.js"
import { OperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { z } from "zod"
import { get, lt, lte } from "lodash-es"

export const MinConstraintJson = ConstraintJson.extend({
    type: z.literal("MinConstraint"),
    min: z.any(),
    inclusive: z.boolean(),
}).required()

export class MinConstraint<T> extends Constraint {
    static readonly type: ConstraintType = ConstraintType.MIN
    private _min: T | null = null
    private _inclusive: boolean = true

    constructor(min: T | null = null, inclusive: boolean = true) {
        super()
        this.min = min
        this._inclusive = inclusive
    }

    set min(min: T | null) {
        this._min = min
        this.isConstraintValid()
    }

    get min(): T | null {
        return this._min
    }

    get inclusive(): boolean {
        return this._inclusive
    }

    set inclusive(inclusive: boolean) {
        this._inclusive = inclusive
    }

    isConstraintValid(): OperationResult {
        if (this.min == null) {
            this._validate_constraint_result = OperationResult.invalid("structural.attribute.constraint.error.min_val_is_null")
        } else {
            this._validate_constraint_result = OperationResult.valid()
        }

        return this.validate_constraint_result
    }

    /**
     * MinConstraint is not compatible to
     * - MaxConstraint with max value smaller than min value 
     */
    isCompatibleTo(constraint: Constraint): boolean {
        let result = super.isCompatibleTo(constraint)
        if (!result) {
            return false
        }

        // if (constraint instanceof MaxConstraint) { // error: RHS is not object
        if (constraint.getType() == ConstraintType.MAX) {
            let max = get(constraint, "max") as unknown
            if (this.min != null && max != null) {
                return this.min <= max
            }
        }

        return true
    }

    getType(): ConstraintType {
        return MinConstraint.type
    }

    validate(value: T): OperationResult {
        let compare_func = this.inclusive ? lt : lte
        if (this.min != null && compare_func(value, this.min)) {
            return OperationResult.invalid("structural.attribute.constraint.error.val_less_than_min")
        }
        return OperationResult.valid()
    }
    
    saveAsJson(): z.infer<typeof MinConstraintJson> {
        return {
            id: this.id,
            type: "MinConstraint",
            min: this.min,
            inclusive: this.inclusive,
        }
    }

    static loadFromJson(json: object): MinConstraint<any> {
        // check if the json_data match the schema
        const result = MinConstraintJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("MinConstraint", result.error.toString())
        }
        const valid_json = result.data

        const constraint = new MinConstraint<any>(valid_json.min, valid_json.inclusive)
        constraint.id = valid_json.id
        return constraint
    }
}
