import { MaxConstrain } from "@/index"
import { Constrain, ConstrainType, ConstrainJson } from "@/note/element/structural/attribute/constrain/Constrain"
import { OperationResult, ValidOperationResult } from "@/common/OperationResult"
import { InvalidJsonFormatException } from "@/exception/ConversionException"
import { z } from "zod"

export const MinConstrainJson = ConstrainJson.extend({
    type: z.literal("MinConstrain"),
    min: z.any(),
}).required()

export class MinConstrain<T> extends Constrain {
    static readonly type: ConstrainType = ConstrainType.MIN
    private _min: T | null = null

    constructor(min: T | null = null) {
        super()
        this.min = min
    }

    set min(min: T | null) {
        this._min = min
        this.constrainIsValid()
    }

    get min(): T | null {
        return this._min
    }

    constrainIsValid(): OperationResult {
        if (this.min == null) {
            this._validate_constrain_result = {
                valid: false,
                invalid_message: "The minimum value is not set"
            }
        } else {
            this._validate_constrain_result = ValidOperationResult
        }

        return this.validate_constrain_result
    }

    /**
     * MinConstrain is not compatible to
     * - MaxConstrain with max value smaller than min value 
     */
    isCompatibleTo(constrain: Constrain): boolean {
        let result = super.isCompatibleTo(constrain)
        if (!result) {
            return false
        }

        // if (constrain instanceof MaxConstrain) { // error: RHS is not object
        if (constrain.getType() == ConstrainType.MAX) {
            let max_constrain = constrain as MaxConstrain<T>
            if (this.min != null && max_constrain.max != null) {
                return this.min <= max_constrain.max
            }
        }
        return true
    }

    getType(): ConstrainType {
        return MinConstrain.type
    }

    public validate(value: T): OperationResult {
        if (this.min != null && value < this.min) {
            return {
                valid: false,
                invalid_message: "The value is smaller than the minimum"
            }
        }
        return ValidOperationResult
    }
    
    saveAsJson(): z.infer<typeof MinConstrainJson> {
        return {
            id: this.id,
            type: "MinConstrain",
            min: this.min,
        }
    }

    static loadFromJson(json: object): MinConstrain<any> {
        // check if the json_data match the schema
        const result = MinConstrainJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("MinConstrain", result.error.toString())
        }
        const valid_json = result.data

        const constrain = new MinConstrain<any>(valid_json.min)
        constrain.id = valid_json.id
        return constrain
    }
}
