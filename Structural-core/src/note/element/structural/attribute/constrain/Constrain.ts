import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import { z } from "zod"

export enum ConstrainType {
    REQUIRE
}

export const ConstrainJson = z.object({
    type: z.string()
}).required()

export type ValidateResult = {
    valid: boolean,
    invalid_message: string
}

export const ValidValidateResult: ValidateResult = {
    valid: true,
    invalid_message: ""
}

export abstract class Constrain extends ComponentBase implements EditPathNode {
    abstract getType(): ConstrainType
    abstract validate(value: any): ValidateResult

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return undefined
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        throw new EndOfEditPathError("Attribute Constrain")
    }

    abstract saveAsJson(): z.infer<typeof ConstrainJson>
}