import { describe, it, expect, beforeEach } from "vitest"
import { OrderedList } from "@/common/OrderedList.js"

describe("OrderedList", () => {
    let ordered_list: OrderedList<number>

    beforeEach(() => {
        ordered_list = new OrderedList()
        ordered_list.add(1)
        ordered_list.add(2)
        ordered_list.add(3)
    })
    
    it("constructor & add", () => {
        expect(ordered_list.order).toStrictEqual([1, 2, 3])
    })

    it("length", () => {
        expect(ordered_list.length()).toBe(3)
    })

    it("remove", () => {
        ordered_list.remove(2)
        expect(ordered_list.order).toStrictEqual([1, 3])
        ordered_list.remove(2)
        expect(ordered_list.order).toStrictEqual([1, 3])
        ordered_list.remove(3)
        expect(ordered_list.order).toStrictEqual([1])
    })

    it("moveUp", () => {
        ordered_list.moveUp(2)
        expect(ordered_list.order).toStrictEqual([2, 1, 3])
        ordered_list.moveUp(2)
        expect(ordered_list.order).toStrictEqual([2, 1, 3])
        ordered_list.moveUp(1)
        expect(ordered_list.order).toStrictEqual([1, 2, 3])
        ordered_list.moveUp(3)
        expect(ordered_list.order).toStrictEqual([1, 3, 2])
    })

    it("moveDown", () => {
        ordered_list.moveDown(2)
        expect(ordered_list.order).toStrictEqual([1, 3, 2])
        ordered_list.moveDown(2)
        expect(ordered_list.order).toStrictEqual([1, 3, 2])
        ordered_list.moveDown(3)
        expect(ordered_list.order).toStrictEqual([1, 2, 3])
        ordered_list.moveDown(1)
        expect(ordered_list.order).toStrictEqual([2, 1, 3])
    })

    it("addBefore", () => {
        ordered_list.addBefore(4, 2)
        expect(ordered_list.order).toStrictEqual([1, 4, 2, 3])
        ordered_list.addBefore(5, 6)
        expect(ordered_list.order).toStrictEqual([1, 4, 2, 3, 5])
        ordered_list.addBefore(6, 1)
        expect(ordered_list.order).toStrictEqual([6, 1, 4, 2, 3, 5])
        ordered_list.addBefore(7, 5)
        expect(ordered_list.order).toStrictEqual([6, 1, 4, 2, 3, 7, 5])
    })

    it("addAfter", () => {
        ordered_list.addAfter(4, 2)
        expect(ordered_list.order).toStrictEqual([1, 2, 4, 3])
        ordered_list.addAfter(5, 6)
        expect(ordered_list.order).toStrictEqual([1, 2, 4, 3, 5])
        ordered_list.addAfter(6, 1)
        expect(ordered_list.order).toStrictEqual([1, 6, 2, 4, 3, 5])
        ordered_list.addAfter(7, 5)
        expect(ordered_list.order).toStrictEqual([1, 6, 2, 4, 3, 5, 7])
    })
})
