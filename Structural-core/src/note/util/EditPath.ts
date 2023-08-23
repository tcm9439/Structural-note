import { UUID } from "@/common/CommonTypes"

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

    constructor(index: UUID) {
        this._index = index
    }

    get index(): UUID {
        return this._index
    }
}

/**
 * The class represent that
 *  how to find the target node from the base node by the edit path.
 */
export class EditPath {
    private _path: EditPathStep[] = []

    append(index: UUID): EditPath {
        this._path.push(new EditPathStep(index))
        return this
    }

    getNodeByPath(root: EditPathNode): EditPathNode {
        let current: EditPathNode | undefined = root
        // console.log("_path", this._path)
        for (let step of this._path) {
            // console.log("step", step)
            current = current.getNextEditPathNode(step.index)
            // console.log("current", current)
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

    getLastStep(): UUID {
        return this._path[this._path.length - 1].index
    }
}