import { Constrain, ValidateResult, ValidValidateResult, ConstrainJson, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
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

    getType(): ConstrainType {
        return RequireConstrain.type
    }

    validate(value: any): ValidateResult {
        if (this._required && value == null) {
            return {
                valid: false,
                invalid_message: "This attribute is required"
            }
        }
        return ValidValidateResult;
    }

    saveAsJson(): z.infer<typeof RequireConstrainJson> {
        return {
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

        return new RequireConstrain(valid_json.required)
    }
}