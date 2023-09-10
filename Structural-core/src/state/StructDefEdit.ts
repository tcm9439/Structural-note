import { UUID } from "@/common/CommonTypes"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { EditingComponent } from "@/note/util/EditingComponent"
import assert from "assert"

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
    CHANGE_ATTR
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

    /**
     * Remove all operations for the attr
     * i.e. only keep the item with different attr_id
     */
    private removeAllOperationForAttr(list: StructEditQueueItem[], attr_id: UUID){
        return list.filter(item => item.attr_id != attr_id)
    }

    /**
     * Return the first item and remove it from the list
     */
    consume(): StructEditQueueItem | null {
        return this._confirmed_items.shift()!
    }
}

export class StructDefEditContext {
    private _state: StructDefEditState = StructDefEditState.EDITING_STRUCT
    private _edit_queue: StructEditQueue = new StructEditQueue()

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
            this.state = StructDefEditState.EDITING_STRUCT
            this._attr_def = null
            return
        } 
        
        // finish editing the struct def
        if (this.hasAttrChange()) {
            this._exitCallback(true)
        } else {
            this._exitCallback(false)
        }
    }

    startEditAttr(attr_id: UUID, confirm_callback?: AttrDefCallback) {
        const attr = this._struct_def.editing.attributes.get(attr_id)
        if (attr == null){
            throw new Error(`Attribute with id ${attr_id} not found`)
        }
        this._attr_def = new EditingComponent(attr, confirm_callback)
        this.state = StructDefEditState.EDITING_ATTR
    }

    attrHasConfirmedEdit(): boolean {
        return this._attr_def?.hasCommit || false
    }

    hasAttrChange(): boolean {
        return this.edit_queue.hasConfirmedItem()
    }

    commitAttr() {
        assert(this.state == StructDefEditState.EDITING_ATTR)
        assert(this.attr_def != null)
        if (this.edit_queue.hasPendingItem()) {
            this.attr_def.commit()
            this.edit_queue.commit()
        }
    }

    commitStruct() {
        assert(this.state == StructDefEditState.EDITING_STRUCT)
        this.struct_def.commit()
    }

    rollbackAttr() {
        assert(this.state == StructDefEditState.EDITING_ATTR)
        assert(this.attr_def != null)
        this.attr_def.rollback()
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

    get struct_def(): EditingComponent<StructureDefinition> {
        return this._struct_def
    }

    get attr_def(): EditingComponent<AttributeDefinition<any>> | null {
        return this._attr_def
    }
}

export class StructDefEditEvent {
    static startAddAttr(state_context: StructDefEditContext, confirm_callback: AttrDefCallback): UUID {
        // init the attr & add the attr to the struct_def
        let attr = new AttributeDefinition()
        state_context.struct_def.editing.attributes.add(attr)

        state_context.startEditAttr(attr.id, confirm_callback)
        state_context.edit_queue.push(new StructEditQueueItem(attr.id, StructEditOperation.ADD_ATTR))
        return attr.id
    }
    
    static startEditAttr(state_context: StructDefEditContext, id: string, confirm_callback: AttrDefCallback) {
        state_context.startEditAttr(id, confirm_callback)
        state_context.edit_queue.push(new StructEditQueueItem(id, StructEditOperation.CHANGE_ATTR))
    }
    
    static deleteAttr(state_context: StructDefEditContext, id: string) {
        state_context.startEditAttr(id)
        state_context.struct_def.editing.attributes.remove(id)
        state_context.edit_queue.push(new StructEditQueueItem(id, StructEditOperation.DELETE_ATTR))
        state_context.commitAttr()
        state_context.exitEdit()
    }
    
    static confirmEditAttr(state_context: StructDefEditContext) {
        state_context.commitAttr()
        state_context.exitEdit()
    }
    
    static cancelEditAttr(state_context: StructDefEditContext) {
        state_context.rollbackAttr()
        state_context.exitEdit()
    }
    
    static confirmEditStruct(state_context: StructDefEditContext){
        state_context.commitStruct()
        state_context.exitEdit()
    }
    
    static cancelEditStruct(state_context: StructDefEditContext) {
        state_context.exitEdit()
    }
}