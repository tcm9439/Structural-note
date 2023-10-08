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

export abstract class Constrain {
    abstract getType(): ConstrainType
    abstract validate(value: any): ValidateResult
}