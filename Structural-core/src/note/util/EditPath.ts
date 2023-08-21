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
    private _root: EditPathNode
    private _path: EditPathStep[] = []

    constructor(base: EditPathNode) {
        this._root = base
    }

    addStep(index: UUID) {
        this._path.push(new EditPathStep(index))
    }

    get root(): EditPathNode {
        return this._root
    }

    getNodeByPath(): EditPathNode {
        let current: EditPathNode | undefined = this._root
        for (let step of this._path) {
            current = current.getNextEditPathNode(step.index)
            if (current === undefined) {
                throw new EndOfEditPathError()
            }
        }
        return current
    }
}