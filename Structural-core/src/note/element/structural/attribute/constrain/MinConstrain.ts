import { Constrain, ConstrainType, ConstrainJson } from "@/note/element/structural/attribute/constrain/Constrain"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { z } from "zod"

export const MinConstrainJson = ConstrainJson.extend({
    type: z.literal("MinConstrain"),
    min: z.any()
}).required()

export class MinConstrain<T> extends Constrain {
    static readonly type: ConstrainType = ConstrainType.MIN
    private _min: T | null
    private _value_type: string | null = null

    constructor(min: T | null = null) {
        super()
        this._min = min
        this.constrainIsValid()
    }

    set valueType(value_type: string | null) {
        this._value_type = value_type
    }

    get valueType(): string | null {
        return this._value_type
    }

    set min(min: T | null) {
        this._min = min
    }

    get min(): T | null {
        return this._min
    }

    constrainIsValid(): ValidateResult {
        if (this.min == null) {
            this._validate_result = {
                valid: false,
                invalid_message: "The minimum value is not set"
            }
        } else {
            this._validate_result = ValidValidateResult
        }

        return this.validate_result
    }

    getType(): ConstrainType {
        return MinConstrain.type
    }

    getRepeatable(): boolean {
        return false
    }

    public validate(value: T): ValidateResult {
        if (this.min != null && value < this.min) {
            return {
                valid: false,
                invalid_message: "The value is smaller than the minimum"
            }
        }
        return ValidValidateResult
    }
    
    saveAsJson(): z.infer<typeof MinConstrainJson> {
        return {
            type: "MinConstrain",
            min: this.min,
        }
    }

    static loadFromJson(json: z.infer<typeof MinConstrainJson>): MinConstrain<any> | null {
        // check if the json_data match the schema
        const result = MinConstrainJson.safeParse(json)
        if (!result.success) {
            console.error(result.error)
            return null
        }
        const valid_json = result.data

        return new MinConstrain(valid_json.min)
    }
}
