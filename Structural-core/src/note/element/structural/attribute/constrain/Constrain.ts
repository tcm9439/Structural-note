import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import { z } from "zod"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"

export enum ConstrainType {
    REQUIRE,
    MIN,
    MAX,
    UNIQUE,
    REGEX,
}

export const ConstrainJson = z.object({
    id: z.string(),
    type: z.string()
}).required()

export abstract class Constrain extends ComponentBase implements EditPathNode {
    // if this constrain is valid
    protected _validate_constrain_result : ValidateResult = ValidValidateResult

    abstract getType(): ConstrainType

    get validate_constrain_result(): ValidateResult {
        return this._validate_constrain_result
    }

    /**
     * Check if the given value is valid regarding to this constrain
     * @param value the value to validate
     */
    abstract validate(value: any): ValidateResult

    /**
     * Check if this constrain is valid
     */
    abstract constrainIsValid(): ValidateResult

    /**
     * Check if this constrain is repeatable 
     * (i.e. if an attribute can have multiple instance of this constrain)
     * @returns true if this constrain is repeatable, false otherwise
     */
    abstract getRepeatable(): boolean

    /**
     * Check if this constrain is compatible to the given constrain
     * (i.e. if an attribute can have both this constrain and the given constrain)
     * @param constrain the constrain to check
     */
    isCompatibleTo(constrain: Constrain): boolean {
        return this.isCompatibleToType(constrain.getType())
    }

    isCompatibleToType(type: ConstrainType): boolean {
        if (this.getType() === type) {
            return this.getRepeatable()
        }
        return true
    }

    /**
     * To filter out the constrains that are incompatible with this constrain
     * @param constrains The constrains to filter
     * @returns The constrains that are compatible with this constrain
     */
    filterOutIncompatible(constrains: ConstrainType[]): ConstrainType[] {
        return constrains.filter(constrain => this.isCompatibleToType(constrain))
    }

    getNextEditPathNode(index: string): EditPathNode | undefined {
        // this is the end of the edit path
        return undefined
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        // this is the end of the edit path
        throw new EndOfEditPathError("Attribute Constrain")
    }

    abstract saveAsJson(): z.infer<typeof ConstrainJson>

    // static loadFromJson(json: z.infer<typeof ConstrainJson>): Constrain | null {}
}