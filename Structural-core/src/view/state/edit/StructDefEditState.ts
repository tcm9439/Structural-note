import { UUID } from "@/common/CommonTypes.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition.js"
import { EditingComponent } from "@/note/util/EditingComponent.js"
import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { ValidOperationResult, OperationResult } from "@/common/OperationResult.js"
import { Logger } from "@/common/Logger.js"

export type AttrDefCallback = (new_attr: AttributeDefinition<any>) => void
export type StructDefCallback = (new_struct: StructureDefinition) => void
export type ExitCallback = (has_change: boolean) => void

/**
 * View mode:   show "Exists attr list" OR "Edit attr def"
 * init:        show list
 * change when: 
 *      - Enter/Cancel edit attr def
 *      - Enter/Cancel edit struct def
 */

export enum StructDefEditState {
    EDITING_STRUCT,
    EDITING_ATTR
}

export enum StructEditOperation {
    ADD_ATTR,
    DELETE_ATTR,
    CHANGE_ATTR,
    CHANGE_ATTR_TYPE,
    MOVE_ATTR,
}

export class StructEditQueueItem {
    private _attr_id: UUID
    private _operation: StructEditOperation

    constructor(attr_id: UUID, operation: StructEditOperation) {
        this._attr_id = attr_id
        this._operation = operation
    }

    get attr_id(): UUID {
        return this._attr_id
    }

    get operation(): StructEditOperation {
        return this._operation
    }
}

export class StructEditQueue {
    private _confirmed_items: StructEditQueueItem[] = []
    private _pending_items: StructEditQueueItem[] = []

    constructor() {}

    push(item: StructEditQueueItem) {
        this._pending_items.push(item)
    }

    private pushToConfirmed(item: StructEditQueueItem) {
        // if operation == delete/change => remove all previous operations for the same attr
        if (item.operation == StructEditOperation.DELETE_ATTR || item.operation == StructEditOperation.CHANGE_ATTR) {
            this._confirmed_items = this.removeAllOperationForAttr(this._confirmed_items, item.attr_id)
        }
        // if operation == add => there should be no previous operations for the same attr
        // if operation == type change => keep the previous operations for the same attr

        this._confirmed_items.push(item)
    }

    hasConfirmedItem(): boolean {
        return this._confirmed_items.length > 0
    }

    hasPendingItem(): boolean {
        return this._pending_items.length > 0
    }

    /**
     * Confirm all pending items
     */
    commit() {
        this._pending_items.forEach(item => this.pushToConfirmed(item))
        this._pending_items = []
    }

    rollback() {
        this._pending_items = []
    }

    purge(){
        this._confirmed_items = []
        this._pending_items = []
    }

    /**
     * Remove all operations for the attr
     * i.e. only keep the item with different attr_id
     */
    private removeAllOperationForAttr(list: StructEditQueueItem[], attr_id: UUID){
        return list.filter(item => item.attr_id != attr_id)
    }

    uncommittedItemsInclude(attr_id: UUID, operation: StructEditOperation): boolean {
        return this._pending_items.some(item => item.attr_id == attr_id && item.operation == operation)
    }

    /**
     * Return the first item and remove it from the list
     */
    consume(): StructEditQueueItem | undefined {
        return this._confirmed_items.shift()!
    }

    clone(): StructEditQueue {
        let new_queue = new StructEditQueue()
        new_queue._confirmed_items = [...this._confirmed_items]
        new_queue._pending_items = [...this._pending_items]
        return new_queue
    }
}

export class StructDefEditContext {
    private _state: StructDefEditState = StructDefEditState.EDITING_STRUCT
    private _edit_queue: StructEditQueue = new StructEditQueue()
    private _has_changes_on_struct: boolean = false

    // the callback when the end state is reached
    private _exitCallback: ExitCallback

    // editing components
    private _struct_def: EditingComponent<StructureDefinition>
    private _attr_def: EditingComponent<AttributeDefinition<any>> | null = null

    constructor(struct_def: StructureDefinition, 
        exitCallback: ExitCallback, confirmEditStructCallback?: StructDefCallback) {
        this._exitCallback = exitCallback
        this._struct_def = new EditingComponent(struct_def, confirmEditStructCallback)
    }

    exitEdit(){
        if (this.state == StructDefEditState.EDITING_ATTR) {
            // rollback the attr def if it is not committed
            this.rollbackAttr()
            this._attr_def = null
            this.state = StructDefEditState.EDITING_STRUCT
        } else {
            // this.state == StructDefEditState.EDITING_STRUCT
            // finish editing the struct def => execute the exit callback
            if (this.hasChange()) {
                this._exitCallback(true)
            } else {
                this._exitCallback(false)
            }
        }
    }

    startEditAttr(attr_id: UUID, confirm_callback?: AttrDefCallback) {
        let attr = this._struct_def.editing.attributes.get(attr_id)
        if (attr == null){
            throw new Error(`Attribute with id ${attr_id} not found`)
        }
        this._attr_def = new EditingComponent(attr, confirm_callback)
        this.state = StructDefEditState.EDITING_ATTR
    }

    hasChange(): boolean {
        return this._has_changes_on_struct || this.edit_queue.hasConfirmedItem()
    }

    setChange(){
        this._has_changes_on_struct = true
    }

    commitAttr() {
        if (this.state != StructDefEditState.EDITING_ATTR){
            Logger.get().warn("Commit attr when not editing attr")
            return 
        }
        if (this.editing_attr_def == null){
            Logger.get().warn("Commit attr when editing attr is null")
            return
        }
        if (this.edit_queue.hasPendingItem()) {
            this.editing_attr_def.commit()
            this.edit_queue.commit()
        }
    }

    rollbackAttr() {
        if (this.state != StructDefEditState.EDITING_ATTR){
            Logger.get().warn("Rollback attr when not editing attr")
            return 
        }
        if (this.editing_attr_def == null){
            Logger.get().warn("Rollback attr when editing attr is null")
            return
        }
        let attr_id = this.editing_attr_def.editing.id

        // if the attr is newly added, remove it from the struct_def
        if (this.edit_queue.uncommittedItemsInclude(attr_id, StructEditOperation.ADD_ATTR)) {
            this.editing_struct_def.editing.attributes.remove(attr_id)
        }

        this.editing_attr_def.rollback()
        this.edit_queue.rollback()
    }

    set state(value: StructDefEditState) {
        this._state = value
    }

    get state(): StructDefEditState {
        return this._state
    }

    get edit_queue(): StructEditQueue {
        return this._edit_queue
    }

    get editing_struct_def(): EditingComponent<StructureDefinition> {
        return this._struct_def
    }

    get editing_attr_def(): EditingComponent<AttributeDefinition<any>> {
        if (this._attr_def === null){
            throw Error("No editing attribute.")
        }
        return this._attr_def
    }
}

export class StructDefEditEvent {
    static updateDisplayKey(state_context: StructDefEditContext){
        state_context.setChange()
    }
    
    static startAddAttr(state_context: StructDefEditContext, confirm_callback?: AttrDefCallback): UUID {
        // init the attr & add the attr to the struct_def
        let attr = new AttributeDefinition()
        state_context.editing_struct_def.editing.attributes.add(attr)

        state_context.startEditAttr(attr.id, confirm_callback)
        state_context.edit_queue.push(new StructEditQueueItem(attr.id, StructEditOperation.ADD_ATTR))
        return attr.id
    }
    
    static startEditAttr(state_context: StructDefEditContext, id: string, confirm_callback?: AttrDefCallback) {
        state_context.startEditAttr(id, confirm_callback)
        state_context.edit_queue.push(new StructEditQueueItem(id, StructEditOperation.CHANGE_ATTR))
    }

    static moveUpAttr(state_context: StructDefEditContext, id: string) {
        state_context.startEditAttr(id)
        state_context.editing_struct_def.editing.attributes.moveUp(id)
        state_context.edit_queue.push(new StructEditQueueItem(id, StructEditOperation.MOVE_ATTR))
        state_context.commitAttr()
        state_context.edit_queue.commit()
        state_context.exitEdit()
    }

    static moveDownAttr(state_context: StructDefEditContext, id: string) {
        state_context.startEditAttr(id)
        state_context.editing_struct_def.editing.attributes.moveDown(id)
        state_context.edit_queue.push(new StructEditQueueItem(id, StructEditOperation.MOVE_ATTR))
        state_context.commitAttr()
        state_context.edit_queue.commit()
        state_context.exitEdit()
    }
    
    static deleteAttr(state_context: StructDefEditContext, id: string) {
        state_context.startEditAttr(id)
        state_context.editing_struct_def.editing.attributes.remove(id)
        state_context.edit_queue.push(new StructEditQueueItem(id, StructEditOperation.DELETE_ATTR))
        state_context.commitAttr()
        state_context.edit_queue.commit()
        state_context.exitEdit()
    }
    
    static confirmEditAttr(state_context: StructDefEditContext): OperationResult {
        // abort confirm if the attr def is not valid
        let validate_result = state_context.editing_attr_def?.editing.validateDefinition()
        if (validate_result !== undefined && !validate_result?.valid) {
            return validate_result
        }
        state_context.commitAttr()
        state_context.edit_queue.commit()
        state_context.exitEdit()
        return ValidOperationResult
    }
    
    static cancelEditAttr(state_context: StructDefEditContext) {
        state_context.rollbackAttr()
        state_context.exitEdit()
    }
    
    static confirmEditStruct(state_context: StructDefEditContext): OperationResult {
        // abort confirm if the struct def is not valid
        let validate_result = state_context.editing_struct_def?.editing.validateDefinition()
        if (validate_result !== undefined && !validate_result?.valid) {
            return validate_result
        }
        state_context.editing_struct_def.commit()
        state_context.exitEdit()
        return ValidOperationResult
    }
    
    static cancelEditStruct(state_context: StructDefEditContext) {
        state_context.editing_struct_def.rollback()
        state_context.edit_queue.purge()
        state_context.exitEdit()
    }

    static attrTypeUpdate(state_context: StructDefEditContext, new_attr_def: AttributeDefinition<any>) {
        let attr_id = state_context.editing_attr_def?.editing.id as UUID
        state_context.edit_queue.push(new StructEditQueueItem(attr_id, StructEditOperation.CHANGE_ATTR_TYPE))

        // set the new attr def in the struct_def
        state_context.editing_struct_def.editing.attributes.override(new_attr_def)
    }
}

export class StructDefEditEventElementHandler {
    static editQueueConsumer(element: StructuralElement, edit_queue: StructEditQueue){
        while (edit_queue.hasConfirmedItem()){
            let edit_queue_item = edit_queue.consume()
            if (edit_queue_item == null){
                Logger.get().warn("Edit queue item is null")
                return
            }
            switch(edit_queue_item.operation){
                case StructEditOperation.ADD_ATTR:
                    StructDefEditEventElementHandler.handleNewAttr(element, edit_queue_item.attr_id)
                    break
                case StructEditOperation.DELETE_ATTR:
                    StructDefEditEventElementHandler.handleDeleteAttr(element, edit_queue_item.attr_id)
                    break
                case StructEditOperation.CHANGE_ATTR_TYPE:
                    StructDefEditEventElementHandler.handleAttrTypeChange(element, edit_queue_item.attr_id)
                    break
                case StructEditOperation.CHANGE_ATTR:
                    StructDefEditEventElementHandler.handleAttrChange(element, edit_queue_item.attr_id)
                    break
            }
        }
    }

    static handleNewAttr(element: StructuralElement, attr_id: UUID){
        // get the definition
        const attr_def = element.definition.attributes.get(attr_id)
        if (attr_def == null){
            throw new Error(`Attribute with id ${attr_id} not found`)
        }
        // create a new value and add it to the element
        let attr_value = new AttributeValue(attr_def)
        element.values.set(attr_id, attr_value)
    }

    static handleDeleteAttr(element: StructuralElement, attr_id: UUID){
        // delete the value from the element
        element.values.delete(attr_id)
    }

    static handleAttrTypeChange(element: StructuralElement, attr_id: UUID){
        // get the new definition
        const attr_def = element.definition.attributes.get(attr_id)
        if (attr_def == null){
            throw new Error(`Attribute with id ${attr_id} not found`)
        }
        const attr_value = element.values.get(attr_id)

        if (attr_value == null){
            throw new Error(`Attribute value with id ${attr_id} not found`)
        }
        
        // convert the value to the new type
        let new_attr_value: AttributeValue<any>
        new_attr_value = attr_value.convertTo(attr_def)
        element.values.set(attr_id, new_attr_value)
    }

    static handleAttrChange(element: StructuralElement, attr_id: UUID){
        const attr_def = element.definition.attributes.get(attr_id)
        if (attr_def == null){
            throw new Error(`Attribute with id ${attr_id} not found`)
        }
        const attr_value = element.values.get(attr_id)
        if (attr_value == null){
            throw new Error(`Attribute value with id ${attr_id} not found`)
        }

        // if the current value is null, set the default value
        if (attr_value.value == null){
            attr_value.value = attr_def.default_value_for_attr
        }

        // validate the value
        attr_value.validate()
    }
}