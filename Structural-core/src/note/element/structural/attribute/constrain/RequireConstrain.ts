import { Constrain, ConstrainJson, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { z } from "zod"

export const RequireConstrainJson = ConstrainJson.extend({
    id: z.string(),
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

    getRepeatable(): boolean {
        return false
    }

    constrainIsValid(): ValidateResult {
        // This constrain is always valid
        return ValidValidateResult
    }

    /**
     * Rule:
     * 1. If the value is null or undefined, it is invalid
     * 2. If the value is a string, and it is empty, it is invalid
     */
    validate(value: any): ValidateResult {
        if (!this._required) {
            return ValidValidateResult;
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

        return ValidValidateResult;
    }

    saveAsJson(): z.infer<typeof RequireConstrainJson> {
        return {
            id: this.id,
            type: "RequireConstrain",
            required: this._required
        }
    }

    static loadFromJson(json: z.infer<typeof RequireConstrainJson>): RequireConstrain | null {
        // check if the json_data match the schema
        const result = RequireConstrainJson.safeParse(json)
        if (!result.success) {
            console.error(result.error)
            return null
        }
        const valid_json = result.data

        let loaded_constrain = new RequireConstrain(valid_json.required)
        loaded_constrain.id = json.id
        return loaded_constrain
    }
}