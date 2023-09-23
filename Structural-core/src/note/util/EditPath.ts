import { UUID } from "@/common/CommonTypes"
import { Cloneable } from "@/common/Cloneable"

export class EndOfEditPathError extends Error {
    constructor(last_element_name?: string) {
        let hint = "Reached the end of the edit path."
        if (last_element_name !== undefined) {
            hint += ` ${last_element_name} is the last element.`
        }
        super(hint)
        this.name = 'EndOfEditPathError'
    }
}

/**
 * A node that appears in the edit path.
 * Can be linked to other nodes by UUID.
 */
export interface EditPathNode {
    getNextEditPathNode(index: UUID): EditPathNode | undefined
    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[]
}

/**
 * The class represent that 
 *  how to choose the next step in the edit path by UUID as index.
 */
export class EditPathStep {
    private _index: UUID
    private _name: string
    private _show_in_breadcrumb: boolean

    constructor(index: UUID, name?: string, show_in_breadcrumb?: boolean) {
        this._index = index
        this._name = name || ""
        this._show_in_breadcrumb = show_in_breadcrumb || false
    }

    get index(): UUID {
        return this._index
    }

    get name(): string {
        return this._name
    }

    get show_in_breadcrumb(): boolean {
        return this._show_in_breadcrumb
    }
}

/**
 * The class represent that
 *  how to find the target node from the base node by the edit path.
 * Also for showing the breadcrumb.
 */
export class EditPath implements Cloneable<EditPath> {
    private _path: EditPathStep[] = []

    append(index: UUID, name?: string, show_in_breadcrumb?: boolean): EditPath {
        this._path.push(new EditPathStep(index, name, show_in_breadcrumb))
        return this
    }

    getNodeByPath(root: EditPathNode): EditPathNode {
        let current: EditPathNode | undefined = root
        for (let step of this._path) {
            current = current.getNextEditPathNode(step.index)
            if (current === undefined) {
                throw new EndOfEditPathError()
            }
        }
        return current
    }

    clone(): EditPath {
        let clone = new EditPath()
        clone._path = this._path.slice()
        return clone
    }

    cloneFrom(other: EditPath): void {
        this._path = other._path.slice()
    }

    getLastStep(): UUID {
        return this._path[this._path.length - 1].index
    }

    getBreadcrumb(): string[] {
        return this._path.filter((step) => step.show_in_breadcrumb).map((step) => step.name)
    }

    cloneDeepWithCustomizer(): EditPath | undefined {
        return this.clone()
    }
}