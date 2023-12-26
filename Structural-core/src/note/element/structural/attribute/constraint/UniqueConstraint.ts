import { Constraint, ConstraintJson, ConstraintType } from "./Constraint.js"
import { OperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { z } from "zod"
import _ from "lodash"

export const UniqueConstraintJson = ConstraintJson.extend({
    type: z.literal("UniqueConstraint"),
}).required()

export class UniqueConstraint extends Constraint {
    static readonly type: ConstraintType = ConstraintType.UNIQUE

    constructor() {
        super()
    }

    getType(): ConstraintType {
        return UniqueConstraint.type
    }

    static isEquals(value_a: any, value_b: any){
        if (_.isObject(value_a) && "equals" in value_a && _.isFunction(value_a.equals)) {
            return value_a.equals(value_b)
        }
        return value_a == value_b
    }

    isRelatedToOtherValues(): boolean {
        return true
    }

    /**
     * Check if every value in the group is unique
     */
    validateValueGroup(values: any[]): OperationResult {
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                // console.log(`i: ${i}, j: ${j}, values[i]: ${values[i]}, values[j]: ${values[j]}`)
                if (UniqueConstraint.isEquals(values[i], values[j])) {
                    return OperationResult.invalid("structural.attribute.constraint.error.val_not_unique")
                }
            }
        }
        return OperationResult.valid()
    }

    saveAsJson(): z.infer<typeof UniqueConstraintJson> {
        return {
            id: this.id,
            type: "UniqueConstraint",
        }
    }

    static loadFromJson(json: object): UniqueConstraint {
        // check if the json_data match the schema
        const result = UniqueConstraintJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("UniqueConstraint", result.error.toString())
        }
        const valid_json = result.data

        let loaded_constraint = new UniqueConstraint()
        loaded_constraint.id = valid_json.id
        return loaded_constraint
    }
}