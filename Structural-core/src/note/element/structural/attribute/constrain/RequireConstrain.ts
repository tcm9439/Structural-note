import { Constrain, ConstrainJson, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { OperationResult, ValidOperationResult } from "@/common/OperationResult"
import { InvalidJsonFormatException } from "@/exception/ConversionException"
import { z } from "zod"

export const RequireConstrainJson = ConstrainJson.extend({
    type: z.literal("RequireConstrain"),
    required: z.boolean()
}).required()

export class RequireConstrain extends Constrain {
    static readonly type: ConstrainType = ConstrainType.REQUIRE
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

    getType(): ConstrainType {
        return RequireConstrain.type
    }
    
    constrainIsValid(): OperationResult {
        // This constrain is always valid
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
            return {
                valid: false,
                invalid_message: "This attribute is required"
            }
        }

        return ValidOperationResult;
    }

    saveAsJson(): z.infer<typeof RequireConstrainJson> {
        return {
            id: this.id,
            type: "RequireConstrain",
            required: this._required
        }
    }

    static loadFromJson(json: z.infer<typeof RequireConstrainJson>): RequireConstrain {
        // check if the json_data match the schema
        const result = RequireConstrainJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("RequireConstrain", result.error.toString())
        }
        const valid_json = result.data

        let loaded_constrain = new RequireConstrain(valid_json.required)
        loaded_constrain.id = json.id
        return loaded_constrain
    }
}