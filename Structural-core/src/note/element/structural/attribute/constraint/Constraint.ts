import { ComponentBase } from "@/note/util/ComponentBase.js"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath.js"
import { OperationResult, ValidOperationResult } from "@/common/OperationResult.js"
import { z } from "zod"

export enum ConstraintType {
    REQUIRE = "REQUIRE",
    MIN = "MIN",
    MAX = "MAX",
    UNIQUE = "UNIQUE",
    REGEX = "REGEX",
}

export const ConstraintJson = z.object({
    id: z.string(),
    type: z.string()
}).required()

export abstract class Constraint extends ComponentBase implements EditPathNode {
    // if this constraint is valid
    protected _validate_constraint_result : OperationResult = ValidOperationResult

    abstract getType(): ConstraintType

    getTypeTranslationKey(): string {
        return `structural.attribute.constraint.${this.getType()}`
    }

    static getTypeTranslationKeyForType(type: ConstraintType | string): string {
        return `structural.attribute.constraint.${type}`
    }

    get validate_constraint_result(): OperationResult {
        return this._validate_constraint_result
    }

    /**
     * Check if the given value is valid regarding to this constraint
     * @param value the value to validate
     */
    abstract validate(value: any): OperationResult

    /**
     * Check if this constraint is valid
     */
    abstract constraintIsValid(): OperationResult

    /**
     * Check if this constraint is compatible to the given constraint
     * (i.e. if an attribute can have both this constraint and the given constraint)
     * @param constraint the constraint to check
     */
    isCompatibleTo(constraint: Constraint): boolean {
        return this.isCompatibleToType(constraint.getType())
    }

    isCompatibleToType(type: ConstraintType): boolean {
        if (this.getType() === type) {
            return false
        }
        return true
    }

    /**
     * To filter out the constraints that are incompatible with this constraint
     * @param constraints The constraints to filter
     * @returns The constraints that are compatible with this constraint
     */
    filterOutIncompatible(constraints: ConstraintType[]): ConstraintType[] {
        return constraints.filter(constraint => this.isCompatibleToType(constraint))
    }

    getNextEditPathNode(index: string): EditPathNode | undefined {
        // this is the end of the edit path
        return undefined
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        // this is the end of the edit path
        throw new EndOfEditPathError("Attribute Constraint")
    }

    abstract saveAsJson(): z.infer<typeof ConstraintJson>

    // static loadFromJson(json: z.infer<typeof ConstraintJson>): Constraint {}
}