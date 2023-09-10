import { describe, it, expect, beforeEach, vi, SpyInstance } from "vitest"
import { StructDefEditState, StructDefEditContext, StructEditQueueItem, StructEditQueue, StructEditOperation } from "@/state/StructDefEdit"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { EditingComponent } from "@/note/util/EditingComponent"

describe("StructEditQueueItem", () => {
    it("constructor & getter", () => {
        let item = new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR)
        expect(item.attr_id).toBe("1234")
        expect(item.operation).toBe(StructEditOperation.ADD_ATTR)
    })
})

describe("StructEditQueue", () => {
    it("push", () => {
        let queue = new StructEditQueue()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR))
        expect(queue["_pending_items"].length).toBe(1)
    })

    it("commit + pushToConfirmed Base", () => {
        let queue = new StructEditQueue()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR))
        queue.commit()
        expect(queue["_pending_items"].length).toBe(0)
        expect(queue["_confirmed_items"].length).toBe(1)
    })

    it("commit + pushToConfirmed + removeAllOperationForAttr", () => {
        let queue = new StructEditQueue()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.CHANGE_ATTR))
        queue.push(new StructEditQueueItem("1234", StructEditOperation.DELETE_ATTR))
        queue.commit()
        expect(queue["_pending_items"].length).toBe(0)
        expect(queue["_confirmed_items"].length).toBe(1)
        expect(queue["_confirmed_items"][0].operation).toBe(StructEditOperation.DELETE_ATTR)
    })

    it("commit + pushToConfirmed + removeAllOperationForAttr", () => {
        let queue = new StructEditQueue()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR))
        queue.push(new StructEditQueueItem("1234", StructEditOperation.CHANGE_ATTR))
        queue.push(new StructEditQueueItem("1234", StructEditOperation.CHANGE_ATTR))
        queue.commit()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.CHANGE_ATTR))
        queue.commit()
        expect(queue["_pending_items"].length).toBe(0)
        expect(queue["_confirmed_items"].length).toBe(1)
        expect(queue["_confirmed_items"][0].operation).toBe(StructEditOperation.CHANGE_ATTR)
    })

    it("rollback", () => {
        let queue = new StructEditQueue()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR))
        queue.rollback()
        expect(queue["_pending_items"].length).toBe(0)
        expect(queue["_confirmed_items"].length).toBe(0)
    })

    it("hasConfirmedItem hasPendingItem", () => {
        let queue = new StructEditQueue()
        expect(queue.hasPendingItem()).toBe(false)
        expect(queue.hasConfirmedItem()).toBe(false)
        queue.push(new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR))
        expect(queue.hasPendingItem()).toBe(true)
        expect(queue.hasConfirmedItem()).toBe(false)
        queue.commit()
        expect(queue.hasPendingItem()).toBe(false)
        expect(queue.hasConfirmedItem()).toBe(true)
    })

    it("consume", () => {
        let queue = new StructEditQueue()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR))
        queue.commit()
        expect(queue.consume()?.operation).toBe(StructEditOperation.ADD_ATTR)
        expect(queue.hasConfirmedItem()).toBe(false)
    })
})
