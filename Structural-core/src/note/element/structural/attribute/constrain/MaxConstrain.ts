import { Constrain, ConstrainType, ConstrainJson } from "@/note/element/structural/attribute/constrain/Constrain"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { z } from "zod"

export const MaxConstrainJson = ConstrainJson.extend({
    type: z.literal("MaxConstrain"),
    max: z.any()
}).required()

export class MaxConstrain<T> extends Constrain {
    static readonly type: ConstrainType = ConstrainType.MAX
    private _max: T | null
    private _value_type: string | null = null

    constructor(max: T | null = null) {
        super()
        this._max = max
        this.constrainIsValid()
    }

    set valueType(value_type: string | null) {
        this._value_type = value_type
    }

    get valueType(): string | null {
        return this._value_type
    }

    set max(max: T | null) {
        this._max = max
    }

    get max(): T | null {
        return this._max
    }

    constrainIsValid(): ValidateResult {
        if (this.max == null) {
            this._validate_result = {
                valid: false,
                invalid_message: "The maximum value is not set"
            }
        } else {
            this._validate_result = ValidValidateResult
        }

        return this.validate_result
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
            type: "MaxConstrain",
            max: this.max,
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

        return new MaxConstrain(valid_json.max)
    }
}
