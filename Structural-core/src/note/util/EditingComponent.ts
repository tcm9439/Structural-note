import { ICloneable } from "@/common/Cloneable.js"

export class EditingComponent<T extends ICloneable> {
    private _untainted_component: T
    private _editing_component: T
    private _commit_callback: ((new_component: T) => void) | null
    private _rollback_callback: ((old_component: T) => void) | null
    private _has_commit: boolean = false

    constructor(component: T, 
        commit_callback?: (new_component: T) => void, 
        rollback_callback?: (untainted_component: T) => void) {
        this._untainted_component = component
        this._editing_component = component.clone()
        this._commit_callback = commit_callback || null
        this._rollback_callback = rollback_callback || null
    }

    get editing(): T {
        return this._editing_component
    }

    get untainted(): T {
        return this._untainted_component
    }

    get hasCommit(): boolean {
        return this._has_commit
    }

    private setCommit() {
        this._has_commit = true
    }
    
    /**
     * Confirm the edit.
     * The new component now becomes the untainted component.
     */
    commit() {
        this.setCommit()
        this._commit_callback && this._commit_callback(this._editing_component)
        this._untainted_component.cloneFrom(this._editing_component)
    }

    /**
     * Give up the edit.
     * Rollback to the untainted component
     */
    rollback() {
        this._rollback_callback && this._rollback_callback(this._untainted_component)
        this._editing_component.cloneFrom(this._untainted_component)
    }
}