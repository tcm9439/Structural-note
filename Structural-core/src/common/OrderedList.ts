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

    /**
     * Add an item before another item.
     * If the before item is not in the list, add the item to the end of the list.
     * @param item The item to add
     * @param before The item that should become the next item of the new item
     */
    addBefore(item: T, before: T): void {
        const index = this._order.indexOf(before)
        if (index >= 0) {
            this._order.splice(index, 0, item)
        } else {
            this.add(item)
        }
    }

    /**
     * Add an item after another item.
     * If the after item is not in the list, add the item to the end of the list.
     * @param item The item to add
     * @param after The item that should become the previous item of the new item
     */
    addAfter(item: T, after: T): void {
        const index = this._order.indexOf(after)
        if (index >= 0) {
            this._order.splice(index + 1, 0, item)
        } else {
            this.add(item)
        }
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