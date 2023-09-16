import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { StructDefEditState, StructDefEditContext, StructEditQueueItem, StructEditQueue, StructEditOperation, StructDefEditEvent, AttrDefCallback, StructDefCallback, ExitCallback } from "@/view/state/StructDefEdit"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"

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

describe("StructDefEditContext", () => {
    let context: StructDefEditContext
    let struct_def: StructureDefinition
    let attr_def: AttributeDefinition<string>
    let exit_callback_spy: ExitCallback
    let confirm_struct_callback_spy: StructDefCallback
    let confirm_attr_callback_spy: AttrDefCallback

    beforeEach(() => {
        struct_def = new StructureDefinition()
        attr_def = new AttributeDefinition("Test String Attr", StringAttribute.instance)
        struct_def.attributes.add(attr_def)

        exit_callback_spy = vi.fn()
        confirm_struct_callback_spy = vi.fn()
        confirm_attr_callback_spy = vi.fn()
        context = new StructDefEditContext(struct_def, exit_callback_spy, confirm_struct_callback_spy)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("constructor", () => {
        expect(context.editing_struct_def.untainted).toEqual(struct_def)
        expect(context.editing_struct_def.editing).toBe(struct_def)
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)
    })

    it("get set state", () => {
        let state = StructDefEditState.EDITING_ATTR
        context.state = state
        expect(context.state).toBe(state)
    })

    it("startEditAttr", () => {
        context.startEditAttr(attr_def.id, confirm_attr_callback_spy)
        expect(context.state).toBe(StructDefEditState.EDITING_ATTR)
        expect(context.editing_attr_def?.editing).toBe(attr_def)
        expect(context.editing_attr_def?.untainted).toEqual(attr_def)
    })

    it("startEditAttr", () => {
        let new_attr = new AttributeDefinition("New Attr", StringAttribute.instance)
        expect(() => {
            context.startEditAttr(new_attr.id, confirm_attr_callback_spy)
        }).toThrow(/Attribute with id .* not found/)
    })

    it("exitEdit: exit edit struct, no change", () => {
        context.state = StructDefEditState.EDITING_STRUCT
        context.exitEdit()
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)
        expect(exit_callback_spy).toBeCalledTimes(1)
        expect(exit_callback_spy).toBeCalledWith(false)
    })
    
    it("exitEdit: exit edit struct, with change", () => {
        context.state = StructDefEditState.EDITING_STRUCT
        const spy = vi.spyOn(context, 'hasAttrChange')
        spy.mockImplementation(() => true)
        context.exitEdit()
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)
        expect(exit_callback_spy).toBeCalledTimes(1)
        expect(exit_callback_spy).toBeCalledWith(true)
    })

    it("exitEdit: exit edit attr", () => {
        context.startEditAttr(attr_def.id, confirm_attr_callback_spy)
        context.exitEdit()
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)
        expect(context.editing_attr_def).toBeNull()
        expect(exit_callback_spy).toBeCalledTimes(0)
    })

    it("hasAttrChange", () => {
        expect(context.hasAttrChange()).toBeFalsy()
        context.edit_queue.push(new StructEditQueueItem(attr_def.id, StructEditOperation.CHANGE_ATTR))
        context.edit_queue.commit()
        expect(context.hasAttrChange()).toBeTruthy()
    })

    it("commitAttr", () => {
        context.startEditAttr(attr_def.id, confirm_attr_callback_spy)
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasAttrChange()).toBeFalsy()
        attr_def.name = "New Name"
        context.edit_queue.push(new StructEditQueueItem(attr_def.id, StructEditOperation.CHANGE_ATTR))
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        context.commitAttr()
        expect(confirm_attr_callback_spy).toBeCalledTimes(1)
        expect(context.editing_attr_def?.editing.name).toBe("New Name")
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasAttrChange()).toBeTruthy()
    })

    it("rollbackAttr", () => {
        context.startEditAttr(attr_def.id, confirm_attr_callback_spy)
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasAttrChange()).toBeFalsy()
        attr_def.name = "New Name"
        context.edit_queue.push(new StructEditQueueItem(attr_def.id, StructEditOperation.CHANGE_ATTR))
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        context.rollbackAttr()
        expect(confirm_attr_callback_spy).toBeCalledTimes(0)
        expect(context.editing_attr_def?.editing.name).toBe("Test String Attr")
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasAttrChange()).toBeFalsy()
    })
})

describe("StructDefEditEvent", () => {
    let context: StructDefEditContext
    let struct_def: StructureDefinition
    let attr_def: AttributeDefinition<string>
    let exit_callback_spy: ExitCallback
    let confirm_struct_callback_spy: StructDefCallback
    let confirm_attr_callback_spy: AttrDefCallback

    beforeEach(() => {
        struct_def = new StructureDefinition()
        attr_def = new AttributeDefinition("Test String Attr", StringAttribute.instance)
        struct_def.attributes.add(attr_def)

        exit_callback_spy = vi.fn()
        confirm_struct_callback_spy = vi.fn()
        confirm_attr_callback_spy = vi.fn()
        context = new StructDefEditContext(struct_def, exit_callback_spy, confirm_struct_callback_spy)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("startAddAttr then commit", () => {
        let attr_id = StructDefEditEvent.startAddAttr(context, confirm_attr_callback_spy)
        expect(struct_def.attributes.get(attr_id)).toBeDefined()
        expect(struct_def.attributes.length()).toBe(2)
        expect(context.state).toBe(StructDefEditState.EDITING_ATTR)
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        StructDefEditEvent.confirmEditAttr(context)
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)
        expect(context.editing_attr_def).toBeNull()
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(struct_def.attributes.length()).toBe(2)
    })

    it("startAddAttr then rollback", () => {
        let attr_id = StructDefEditEvent.startAddAttr(context, confirm_attr_callback_spy)
        expect(struct_def.attributes.get(attr_id)).toBeDefined()
        expect(struct_def.attributes.length()).toBe(2)
        expect(context.state).toBe(StructDefEditState.EDITING_ATTR)
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        StructDefEditEvent.cancelEditAttr(context)
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)
        expect(context.editing_attr_def).toBeNull()
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(struct_def.attributes.length()).toBe(1)
    })

    it("startEditAttr then commit", () => {
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        expect(context.state).toBe(StructDefEditState.EDITING_ATTR)
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        attr_def.name = "New Name"
        StructDefEditEvent.confirmEditAttr(context)
        expect(confirm_attr_callback_spy).toBeCalledTimes(1)
        expect(attr_def.name).toBe("New Name")
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
    })

    it("deleteAttr", () => {
        StructDefEditEvent.deleteAttr(context, attr_def.id)
        expect(struct_def.attributes.length()).toBe(0)
    })

    it("confirmEditStruct after change", () => {
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        attr_def.name = "New Name"
        StructDefEditEvent.confirmEditAttr(context)
        StructDefEditEvent.confirmEditStruct(context)
        expect(struct_def.attributes.get(attr_def.id)?.name).toBe("New Name")
    })

    it("cancelEditStruct after change", () => {
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        attr_def.name = "New Name"
        StructDefEditEvent.confirmEditAttr(context)
        console.log(context.editing_struct_def.editing.attributes)
        console.log(context.editing_struct_def.untainted.attributes)
        StructDefEditEvent.cancelEditStruct(context)
        console.log(context.editing_struct_def.editing.attributes)
        console.log(context.editing_struct_def.untainted.attributes)
        expect(struct_def.attributes.get(attr_def.id)?.name).toBe("Test String Attr")
    })

    it("attrTypeUpdate", () => {
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        expect(context.edit_queue["_pending_items"].length).toBe(1)
        StructDefEditEvent.attrTypeUpdate(context)
        expect(context.edit_queue["_pending_items"].length).toBe(2)
        expect(context.edit_queue["_pending_items"][0].operation).toBe(StructEditOperation.CHANGE_ATTR)
        expect(context.edit_queue["_pending_items"][1].operation).toBe(StructEditOperation.CHANGE_ATTR_TYPE)
    })
})