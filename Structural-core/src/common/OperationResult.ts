import { TranslatableText } from "@/common/Translatable.js"
import { TranslationParameter } from "@/common/TranslationManager.js"

/**
 * Represent the result of an operation (function).
 * Useful for displaying error messages.
 */
export class OperationResult {
    private _valid: boolean
    private _invalid_message: TranslatableText | undefined | null

    constructor(valid: boolean, invalid_message?: TranslatableText) {
        this._valid = valid
        this._invalid_message = invalid_message
    }

    static invalid(invalid_message_key: string, tran_prams?: TranslationParameter): OperationResult {
        return new OperationResult(false, TranslatableText.new(invalid_message_key, tran_prams))
    }

    static invalidText(invalid_message: TranslatableText): OperationResult {
        return new OperationResult(false, invalid_message)
    }

    static valid(): OperationResult {
        return ValidOperationResult
    }

    get valid(): boolean {
        return this._valid
    }

    get invalid_message(): string {
        if (this._invalid_message){
            return this._invalid_message.toDisplayText()
        }
        return ""
    }

    setInvalidMessage(message: TranslatableText): OperationResult {
        this._invalid_message = message
        return this
    }

    getRawInvalidMessage(): TranslatableText | null | undefined {
        return this._invalid_message
    }
}

export const ValidOperationResult: OperationResult = new OperationResult(true);
