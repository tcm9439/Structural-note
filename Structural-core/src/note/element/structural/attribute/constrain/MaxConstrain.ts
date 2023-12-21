import { Constrain, ConstrainType, ConstrainJson } from "@/note/element/structural/attribute/constrain/Constrain"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { OperationResult, ValidOperationResult } from "@/common/OperationResult"
import { z } from "zod"
import { InvalidJsonFormatException } from "@/exception/ConversionException"


export const MaxConstrainJson = ConstrainJson.extend({
    type: z.literal("MaxConstrain"),
    max: z.any(),
}).required()

export class MaxConstrain<T> extends Constrain {
    static readonly type: ConstrainType = ConstrainType.MAX
    private _max: T | null = null

    constructor(max: T | null = null) {
        super()
        this.max = max
    }

    set max(max: T | null) {
        this._max = max
        this.constrainIsValid()
    }

    get max(): T | null {
        return this._max
    }

    constrainIsValid(): OperationResult {
        if (this.max == null) {
            this._validate_constrain_result = {
                valid: false,
                invalid_message: "The maximum value is not set"
            }
        } else {
            this._validate_constrain_result = ValidOperationResult
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
    
    public validate(value: T): OperationResult {
        if (this.max != null && value > this.max) {
            return {
                valid: false,
                invalid_message: "The value is larger than the maximum"
            }
        }
        return ValidOperationResult
    }
    
    saveAsJson(): z.infer<typeof MaxConstrainJson> {
        return {
            id: this.id,
            type: "MaxConstrain",
            max: this.max,
        }
    }

    static loadFromJson(json: object): MaxConstrain<any> {
        // check if the json_data match the schema
        const result = MaxConstrainJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("MaxConstrain", result.error.toString())
        }
        const valid_json = result.data

        let max_constrain = new MaxConstrain<any>(valid_json.max)
        max_constrain.id = valid_json.id
        return max_constrain
    }
}
