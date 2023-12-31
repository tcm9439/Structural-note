import { describe, it, expect, beforeEach, vi, afterEach, beforeAll } from "vitest"
import { StructDefEditState, StructDefEditContext, StructEditQueueItem, StructEditQueue, StructEditOperation, StructDefEditEvent, AttrDefCallback, StructDefCallback, ExitCallback, StructDefEditEventElementHandler, ModuleInit } from "@/index.js"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { ShortStringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute.js"
import { StructuralElement } from "@/index.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"

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

    it("purge", () => {
        let queue = new StructEditQueue()
        queue.push(new StructEditQueueItem("1234", StructEditOperation.ADD_ATTR))
        queue.commit()
        queue.push(new StructEditQueueItem("3344", StructEditOperation.ADD_ATTR))
        expect(queue["_pending_items"].length).toBe(1)
        expect(queue["_confirmed_items"].length).toBe(1)
        
        queue.purge()
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
        attr_def = new AttributeDefinition("Test String Attr", ShortStringAttribute.instance)
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
        expect(context.editing_struct_def.editing).toEqual(struct_def)
        expect(context.editing_struct_def.untainted).toBe(struct_def)
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
        expect(context.editing_attr_def.editing).toEqual(attr_def)
        expect(context.editing_attr_def.untainted).not.toBe(attr_def)
    })

    it("startEditAttr", () => {
        let new_attr = new AttributeDefinition("New Attr", ShortStringAttribute.instance)
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
        const spy = vi.spyOn(context, 'hasChange')
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
        expect(context["_attr_def"]).toBeNull()
        expect(exit_callback_spy).toBeCalledTimes(0)
    })

    it("hasAttrChange", () => {
        expect(context.hasChange()).toBeFalsy()
        context.edit_queue.push(new StructEditQueueItem(attr_def.id, StructEditOperation.CHANGE_ATTR))
        context.edit_queue.commit()
        expect(context.hasChange()).toBeTruthy()
    })

    it("commitAttr", () => {
        context.startEditAttr(attr_def.id, confirm_attr_callback_spy)
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasChange()).toBeFalsy()
        context.editing_attr_def.editing.name = "New Name"
        context.edit_queue.push(new StructEditQueueItem(attr_def.id, StructEditOperation.CHANGE_ATTR))
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        context.commitAttr()
        expect(confirm_attr_callback_spy).toBeCalledTimes(1)
        expect(context.editing_attr_def?.editing.name).toBe("New Name")
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasChange()).toBeTruthy()
    })

    it("rollbackAttr", () => {
        context.startEditAttr(attr_def.id, confirm_attr_callback_spy)
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasChange()).toBeFalsy()
        context.editing_attr_def.editing.name = "New Name"
        context.edit_queue.push(new StructEditQueueItem(attr_def.id, StructEditOperation.CHANGE_ATTR))
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        context.rollbackAttr()
        expect(confirm_attr_callback_spy).toBeCalledTimes(0)
        expect(context.editing_attr_def?.editing.name).toBe("Test String Attr")
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(context.hasChange()).toBeFalsy()
    })
})

describe("StructDefEditEvent", () => {
    let context: StructDefEditContext
    let struct_def: StructureDefinition
    let attr_def: AttributeDefinition<string>
    let exit_callback_spy: ExitCallback
    let confirm_struct_callback_spy: StructDefCallback
    let confirm_attr_callback_spy: AttrDefCallback

    beforeAll(async () => {
        await ModuleInit.init()
    })

    beforeEach(() => {
        struct_def = new StructureDefinition()
        attr_def = new AttributeDefinition("Test String Attr", ShortStringAttribute.instance)
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
        expect(context.editing_struct_def.editing.attributes.get(attr_id)).toBeDefined()
        expect(context.editing_struct_def.editing.attributes.length()).toBe(2)
        expect(context.state).toBe(StructDefEditState.EDITING_ATTR)
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        // the attr name (& other stuff) is not set yet => invalid
        let validate_def_result = StructDefEditEvent.confirmEditAttr(context)
        expect(validate_def_result.valid).toBeFalsy()

        // set the attr props
        let editing_attr_def = context.editing_attr_def.editing
        editing_attr_def.name = "New Name"
        editing_attr_def.description = "New Description"
        editing_attr_def.attribute_type = IntegerAttribute.instance

        // confirm changes
        validate_def_result = StructDefEditEvent.confirmEditAttr(context)
        expect(validate_def_result.valid).toBeTruthy()
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)

        expect(context["_attr_def"]).toBeNull()
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()

        // editing struct def is updated
        expect(context.editing_struct_def.editing.attributes.length()).toBe(2)
        // the ori struct def is not affected
        expect(struct_def.attributes.length()).toBe(1)
    })

    it("startAddAttr then rollback", () => {
        let attr_id = StructDefEditEvent.startAddAttr(context, confirm_attr_callback_spy)
        expect(context.editing_struct_def.editing.attributes.get(attr_id)).toBeDefined()
        expect(context.editing_struct_def.editing.attributes.length()).toBe(2)
        expect(context.state).toBe(StructDefEditState.EDITING_ATTR)
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        StructDefEditEvent.cancelEditAttr(context)
        expect(context.state).toBe(StructDefEditState.EDITING_STRUCT)
        expect(context["_attr_def"]).toBeNull()
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        expect(struct_def.attributes.length()).toBe(1)
    })

    it("startEditAttr then commit", () => {
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        expect(context.state).toBe(StructDefEditState.EDITING_ATTR)
        expect(context.edit_queue.hasPendingItem()).toBeTruthy()

        context.editing_attr_def.editing.name = "New Name"
        StructDefEditEvent.confirmEditAttr(context)
        expect(confirm_attr_callback_spy).toBeCalledTimes(1)
        expect(context.editing_struct_def.editing.attributes.get(attr_def.id)?.name).toBe("New Name")
        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
    })

    it("deleteAttr", () => {
        console.log(context.editing_struct_def.editing.attributes.components)
        console.log(attr_def.id)
        StructDefEditEvent.deleteAttr(context, attr_def.id)
        expect(context.editing_struct_def.editing.attributes.length()).toBe(0)
        expect(struct_def.attributes.length()).toBe(1)
    })

    it("confirmEditStruct after change", () => {
        let value = new AttributeValue(attr_def, "1234")
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        context.editing_attr_def.editing.name = "New Name"
        let new_attr_def = context.editing_attr_def.editing
        StructDefEditEvent.confirmEditAttr(context)
        StructDefEditEvent.confirmEditStruct(context)
        expect(context.editing_struct_def.editing.attributes.get(attr_def.id)?.name).toBe("New Name")
        expect(context.editing_struct_def.untainted.attributes.get(attr_def.id)?.name).toBe("New Name")
        expect(value.definition).toEqual(new_attr_def)
        expect(value.definition.name).toBe("New Name")
    })

    it("cancelEditStruct after change", () => {
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        context.editing_attr_def.editing.name = "New Name"
        StructDefEditEvent.confirmEditAttr(context)
        StructDefEditEvent.cancelEditStruct(context)
        expect(struct_def.attributes.get(attr_def.id)?.name).toBe("Test String Attr")
    })

    it("attrTypeUpdate", () => {
        let element = new StructuralElement(struct_def)
        // add a value for the attr
        let value = new AttributeValue(attr_def, "1234")
        element.setValue(attr_def, value)

        expect(context.edit_queue.hasPendingItem()).toBeFalsy()
        StructDefEditEvent.startEditAttr(context, attr_def.id, confirm_attr_callback_spy)
        expect(context.edit_queue["_pending_items"].length).toBe(1)

        // update the attr type
        let new_attr_def = AttributeDefinition.convertToType(attr_def, IntegerAttribute.instance)
        StructDefEditEvent.attrTypeUpdate(context, new_attr_def)

        // queue
        expect(context.edit_queue["_pending_items"].length).toBe(2)
        expect(context.edit_queue["_pending_items"][0].operation).toBe(StructEditOperation.CHANGE_ATTR)
        expect(context.edit_queue["_pending_items"][1].operation).toBe(StructEditOperation.CHANGE_ATTR_TYPE)
        // attr def
        expect(context.editing_struct_def.editing.attributes.get(attr_def.id)?.attribute_type).toBe(IntegerAttribute.instance)
    })
})

describe("StructDefEditEventElementHandler", () => {
    let element: StructuralElement
    let edit_queue: StructEditQueue
    let attr_def: AttributeDefinition<any>
    let attr_def2: AttributeDefinition<string>
    let spy_handleNewAttr: any
    let ori_def: StructureDefinition

    beforeAll(async () => {
        await ModuleInit.init()
    })

    beforeEach(() => {
        vi.clearAllMocks()
        const definition = new StructureDefinition((id) => [])
        element = new StructuralElement(definition)
        edit_queue = new StructEditQueue()
        attr_def = new AttributeDefinition("Test String Attr", ShortStringAttribute.instance)
        attr_def2 = new AttributeDefinition("Test String Attr 2", ShortStringAttribute.instance)
        element.definition.attributes.add(attr_def)
        element.definition.attributes.add(attr_def2)
        ori_def = definition.clone()

        edit_queue.push(new StructEditQueueItem(attr_def.id, StructEditOperation.ADD_ATTR))
        edit_queue.push(new StructEditQueueItem(attr_def2.id, StructEditOperation.ADD_ATTR))
        edit_queue.commit()
        expect(edit_queue.hasConfirmedItem()).toBeTruthy()

        spy_handleNewAttr = vi.spyOn(StructDefEditEventElementHandler, 'handleNewAttr')
        StructDefEditEventElementHandler.editQueueConsumer(element, ori_def, edit_queue)
    })

    it("editQueueConsumer", () => {
        // check if the handleNewAttr is called twice
        expect(spy_handleNewAttr).toBeCalledTimes(2)
        // all confirmed items should be consumed
        expect(edit_queue.hasConfirmedItem()).toBeFalsy() 
    })

    it("handleNewAttr", () => {
        // check if the new attr is added to the element
        let value = element.values.get(attr_def.id)
        expect(value).toBeDefined()
        expect(value?.value).toBe(attr_def.default_value_for_attr)
        expect(value?.definition_id).toBe(attr_def.id)

        value = element.values.get(attr_def2.id)
        expect(value).toBeDefined()
        expect(value?.value).toBe(attr_def.default_value_for_attr)
        expect(value?.definition_id).toBe(attr_def2.id)
    })

    it("handleDeleteAttr", () => {
        // delete the attr
        element.definition.attributes.remove(attr_def.id)
        StructDefEditEventElementHandler.handleDeleteAttr(element, attr_def.id)

        // check if the attr is deleted from the element
        expect(element.values.get(attr_def.id)).toBeUndefined()
        expect(element.values.get(attr_def2.id)).toBeDefined()
    })

    it("handleAttrTypeChange - valid", () => {
        // set the attr value
        let value = element.values.get(attr_def.id)
        if (value != null){
            value.value = "1234"
        }

        // set the attr type to number
        let new_attr_def = AttributeDefinition.convertToType(attr_def, IntegerAttribute.instance)
        element.definition.attributes.override(new_attr_def)
        StructDefEditEventElementHandler.handleAttrTypeChange(element, ori_def, attr_def.id)

        // check if the attr is updated
        let converted_value = element.values.get(attr_def.id)
        expect(converted_value).toBeDefined()
        expect(converted_value?.value).toBe(1234)
    })

    it("handleAttrTypeChange - invalid", () => {
        // set the attr value
        let value = element.values.get(attr_def.id)
        if (value != null){
            value.value = "invalid"
        }

        // set the attr type to number
        let new_attr_def = AttributeDefinition.convertToType(attr_def, IntegerAttribute.instance)
        element.definition.attributes.override(new_attr_def)
        StructDefEditEventElementHandler.handleAttrTypeChange(element, ori_def, attr_def.id)

        // check if the attr is updated
        let converted_value = element.values.get(attr_def.id)
        expect(converted_value).toBeDefined()
        // as the value is invalid, it should be set to default value
        expect(converted_value?.value).toBe(IntegerAttribute.instance.default_value)
    })
})