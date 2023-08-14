import { describe, it, expect, beforeEach } from "vitest"
import { OrderedList } from "@/common/OrderedList"

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
})
