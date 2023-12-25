import { ComponentBase } from "@/note/util/ComponentBase.js"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath.js"
import { OperationResult, ValidOperationResult } from "@/common/OperationResult.js"
import { z } from "zod"

export enum ConstrainType {
    REQUIRE = "REQUIRE",
    MIN = "MIN",
    MAX = "MAX",
    UNIQUE = "UNIQUE",
    REGEX = "REGEX",
}

export const ConstrainJson = z.object({
    id: z.string(),
    type: z.string()
}).required()

export abstract class Constrain extends ComponentBase implements EditPathNode {
    // if this constrain is valid
    protected _validate_constrain_result : OperationResult = ValidOperationResult

    abstract getType(): ConstrainType

    getTypeTranslationKey(): string {
        return `structural.attribute.constraint.${this.getType()}`
    }

    static getTypeTranslationKeyForType(type: ConstrainType): string {
        return `structural.attribute.constraint.${type}`
    }

    get validate_constrain_result(): OperationResult {
        return this._validate_constrain_result
    }

    /**
     * Check if the given value is valid regarding to this constrain
     * @param value the value to validate
     */
    abstract validate(value: any): OperationResult

    /**
     * Check if this constrain is valid
     */
    abstract constrainIsValid(): OperationResult

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
            return false
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

    // static loadFromJson(json: z.infer<typeof ConstrainJson>): Constrain {}
}