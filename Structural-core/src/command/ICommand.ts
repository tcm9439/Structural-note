export interface ICommand {
    execute(): void
    undo(): void
}

export class CommandHistory {
    private _history: Array<ICommand> = []
    private _current_index: number = -1
    private _size_limit: number

    constructor(size_limit: number) {
        this._size_limit = size_limit
    }

    length(): number {
        return this._history.length
    }

    push(command: ICommand): void {
        if (this._current_index < this._history.length - 1) {
            this._history.splice(this._current_index + 1)
        }
        this._history.push(command)
        this._current_index++
        if (this._history.length > this._size_limit) {
            this._history.splice(0, 1)
            this._current_index--
        }
        command.execute()
    }

    undo(): void {
        if (this._current_index >= 0) {
            this._history[this._current_index].undo()
            this._current_index--
        }
    }

    redo(): void {
        if (this._current_index < this._history.length - 1) {
            this._current_index++
            this._history[this._current_index].execute()
        }
    }
}