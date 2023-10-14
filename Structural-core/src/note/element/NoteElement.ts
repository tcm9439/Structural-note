import { UUID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPathNode, EndOfEditPathError, EditPath } from "@/note/util/EditPath"
import { z } from "zod"

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