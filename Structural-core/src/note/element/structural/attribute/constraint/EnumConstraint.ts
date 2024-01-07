import { Constraint, ConstraintJson, ConstraintType } from "./Constraint.js"
import { OperationResult } from "@/common/OperationResult.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { z } from "zod"

export const EnumConstraintJson = ConstraintJson.extend({
    type: z.literal("EnumConstraint"),
    values: z.map(z.number(), z.string()),
    max_index: z.number(),
}).required()

export class EnumConstraint extends Constraint {
    static readonly type: ConstraintType = ConstraintType.ENUM

    // not a set as we need to keep the order even some value is deleted
    private _available_values: Map<number, string> = new Map()

    private _max_index: number = 0

    constructor(available_values: string[] | Map<number, string> = [], max_index: number = 0) {
        super()
        this.available_values = available_values
        this._max_index = max_index
    }

    getType(): ConstraintType {
        return EnumConstraint.type
    }

    get available_values(): string[] {
        return [...this._available_values.values()]
    }

    getAvailableValuesMap(): Map<number, string> {
        return this._available_values
    }

    set available_values(values: string[] | Set<string> | Map<number, string>) {
        // if values is a map
        if (values instanceof Map) {
            this._available_values = values
            this._max_index = Math.max(...values.keys())
        } else {
            this._available_values.clear()
            values.forEach(value => this.addAvailableValue(value))
        }
    }

    private getByValue(value: string): number | null {
        for (let [key, value] of this._available_values.entries()) {
            if (value === value)
            return key
        }
        return null
    }

    /**
     * Add a new enum value
     * @param value enum value to add
     * @returns new index of the enum value, or null if the value already exists
     */
    addAvailableValue(value: string): number | null {
        if (this.available_values.includes(value)){
            // already exists
            return null
        }
        this._available_values.set(this._max_index, value)
        this._max_index += 1
        return this._max_index - 1
    }

    removeAvailableValue(index: number) {
        this._available_values.delete(index)
        // max_index will not be decreased as the key must be unique among all values that have been added
    }

    validate(index: any): OperationResult {
        if (!this.getAvailableValuesMap().has(index)) {
            return OperationResult.invalid("structural.attribute.constraint.error.val_not_in_enum")
        }
        return OperationResult.valid()
    }

    saveAsJson(): z.infer<typeof EnumConstraintJson> {
        return {
            id: this.id,
            type: "EnumConstraint",
            values: this._available_values,
            max_index: this._max_index,
        }
    }

    static loadFromJson(json: object): EnumConstraint {
        // check if the json_data match the schema
        const result = EnumConstraintJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("EnumConstraint", result.error.toString())
        }
        const valid_json = result.data
        let loaded_constraint = new EnumConstraint(valid_json.values, valid_json.max_index)
        loaded_constraint.id = valid_json.id
        return loaded_constraint
    }
}