import { Constraint, ConstraintType, ConstraintJson } from "./Constraint.js"
import { OperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { z } from "zod"
import { get, gte, gt } from "lodash-es"

export const MaxConstraintJson = ConstraintJson.extend({
    type: z.literal("MaxConstraint"),
    max: z.any(),
    inclusive: z.boolean(),
}).required()

export class MaxConstraint<T> extends Constraint {
    static readonly type: ConstraintType = ConstraintType.MAX
    private _max: T | null = null
    private _inclusive: boolean = true

    constructor(max: T | null = null, inclusive: boolean = true) {
        super()
        this.max = max
        this._inclusive = inclusive
    }

    set max(max: T | null) {
        this._max = max
        this.isConstraintValid()
    }

    get max(): T | null {
        return this._max
    }

    get inclusive(): boolean {
        return this._inclusive
    }

    set inclusive(inclusive: boolean) {
        this._inclusive = inclusive
    }

    isConstraintValid(): OperationResult {
        if (this.max == null) {
            this._validate_constraint_result = OperationResult.invalid("structural.attribute.constraint.error.max_val_is_null")
        } else {
            this._validate_constraint_result = OperationResult.valid()
        }

        return this.validate_constraint_result
    }

    /**
     * MaxConstraint is not compatible to
     * - MinConstraint with min value greater than max value 
     */
    isCompatibleTo(constraint: Constraint): boolean {
        let result = super.isCompatibleTo(constraint)
        if (!result) {
            return false
        }

        if (constraint.getType() == ConstraintType.MIN) {
            let min = get(constraint, "min") as unknown
            if (this.max != null && min != null) {
                return this.max >= min
            }
        }

        return true
    }

    getType(): ConstraintType {
        return MaxConstraint.type
    }
    
    validate(value: T): OperationResult {
        let compare_func = this.inclusive ? gt : gte
        if (this.max != null && compare_func(value, this.max)){
            return OperationResult.invalid("structural.attribute.constraint.error.val_larger_than_max")
        }
        return OperationResult.valid()
    }
    
    saveAsJson(): z.infer<typeof MaxConstraintJson> {
        return {
            id: this.id,
            type: "MaxConstraint",
            max: this.max,
            inclusive: this.inclusive,
        }
    }

    static loadFromJson(json: object): MaxConstraint<any> {
        // check if the json_data match the schema
        const result = MaxConstraintJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("MaxConstraint", result.error.toString())
        }
        const valid_json = result.data

        let max_constraint = new MaxConstraint<any>(valid_json.max, valid_json.inclusive)
        max_constraint.id = valid_json.id
        return max_constraint
    }
}
