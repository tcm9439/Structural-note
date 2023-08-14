export class OrderedList<T>{
    private _order: Array<T> = []

    constructor() {
    }

    get order(): Array<T> {
        return this._order
    }

    length(): number {
        return this._order.length
    }

    add(item: T): void {
        this._order.push(item)
    }

    remove(item: T): void {
        const index = this._order.indexOf(item)
        if (index >= 0) {
            this._order.splice(index, 1)
        }
    }

    moveUp(item: T): void {
        const index = this._order.indexOf(item)
        if (index > 0) {
            this._order.splice(index, 1)
            this._order.splice(index - 1, 0, item)
        }
    }

    moveDown(item: T): void {
        const index = this._order.indexOf(item)
        if (index >= 0 && index < this._order.length - 1) {
            this._order.splice(index, 1)
            this._order.splice(index + 1, 0, item)
        }
    }
}