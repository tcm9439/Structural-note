import { UUID } from "@/common/CommonTypes.js"
import { ComponentBase } from "@/note/util/ComponentBase.js"
import { EditPathNode, EndOfEditPathError, EditPath } from "@/note/util/EditPath.js"
import { z } from "zod"

export enum ElementType {
    TEXT = "TEXT",
    STRUCT = "STRUCT",
    MARKDOWN = "MARKDOWN",
}

export const NoteElementJson = z.object({
    type: z.string(),
    id: z.string()
}).required()

/**
 * An element of a section.
 */
export abstract class NoteElement extends ComponentBase implements EditPathNode {
    getNextEditPathNode(index: UUID): EditPathNode | undefined {
        return undefined
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        throw new EndOfEditPathError("NoteElement")
    }

    abstract saveAsJson(): z.infer<typeof NoteElementJson>
}