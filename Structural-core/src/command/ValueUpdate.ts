import { ICommand } from "@/command/ICommand.js"
import { Consumer } from "@/common/CommonTypes.js"

export class ValueUpdateCommand implements ICommand {
    private _old_value: any
    private _new_value: any
    private _setter: (value: any) => void

    constructor(new_value: any, getter: Consumer, setter: (value: any) => void) {
        this._old_value = getter()
        this._new_value = new_value
        this._setter = setter
    }

    static new(object: any, property: string, new_value: any): ValueUpdateCommand {
        let getter = () => object[property]
        let setter = (value: any) => { object[property] = value }
        return new ValueUpdateCommand(new_value, getter, setter)
    }

    execute(): void {
        this._setter(this._new_value)
    }

    undo(): void {
        this._setter(this._old_value)
    }
}