import { ICommand } from "@/command/ICommand"

export class ValueUpdateCommand implements ICommand {
    private _old_value: any
    private _new_value: any
    private _setter: (value: any) => void

    constructor(old_value: any, new_value: any, setter: (value: any) => void) {
        this._old_value = old_value
        this._new_value = new_value
        this._setter = setter
    }

    execute(): void {
        this._setter(this._new_value)
    }

    undo(): void {
        this._setter(this._old_value)
    }
}