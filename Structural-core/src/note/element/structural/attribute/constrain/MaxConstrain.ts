import { Constrain, ConstrainType, ConstrainJson } from "@/note/element/structural/attribute/constrain/Constrain"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { z } from "zod"

export const MaxConstrainJson = ConstrainJson.extend({
    type: z.literal("MaxConstrain"),
    max: z.any(),
    value_type: z.string().nullable()
}).required()

export class MaxConstrain<T> extends Constrain {
    static readonly type: ConstrainType = ConstrainType.MAX
    private _max: T | null = null
    private _value_type: string | null = null

    constructor(max: T | null = null, value_type: string | null = null) {
        super()
        this.max = max
        this.valueType = value_type
    }

    set valueType(value_type: string | null) {
        this._value_type = value_type
    }

    get valueType(): string | null {
        return this._value_type
    }

    set max(max: T | null) {
        this._max = max
        this.constrainIsValid()
    }

    get max(): T | null {
        return this._max
    }

    constrainIsValid(): ValidateResult {
        if (this.max == null) {
            this._validate_constrain_result = {
                valid: false,
                invalid_message: "The maximum value is not set"
            }
        } else {
            this._validate_constrain_result = ValidValidateResult
        }

        return this.validate_constrain_result
    }

    /**
     * MaxConstrain is not compatible to
     * - MinConstrain with min value greater than max value 
     */
    isCompatibleTo(constrain: Constrain): boolean {
        let result = super.isCompatibleTo(constrain)
        if (!result) {
            return false
        }

        if (constrain instanceof MinConstrain) {
            if (this.max != null && constrain.min != null) {
                return this.max >= constrain.min
            }
        }

        return true
    }

    getType(): ConstrainType {
        return MaxConstrain.type
    }

    getRepeatable(): boolean {
        return false
    }

    public validate(value: T): ValidateResult {
        if (this.max != null && value > this.max) {
            return {
                valid: false,
                invalid_message: "The value is larger than the maximum"
            }
        }
        return ValidValidateResult
    }
    
    saveAsJson(): z.infer<typeof MaxConstrainJson> {
        return {
            id: this.id,
            type: "MaxConstrain",
            max: this.max,
            value_type: this.valueType,
        }
    }

    static loadFromJson(json: z.infer<typeof MaxConstrainJson>): MaxConstrain<any> | null {
        // check if the json_data match the schema
        const result = MaxConstrainJson.safeParse(json)
        if (!result.success) {
            console.error(result.error)
            return null
        }
        const valid_json = result.data

        let max_constrain = new MaxConstrain<any>(valid_json.max, valid_json.value_type)
        max_constrain.id = valid_json.id
        return max_constrain
    }
}
