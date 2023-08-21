import { UUID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPathNode, EndOfEditPathError, EditPath } from "@/note/util/EditPath"

/**
 * An element of a section.
 */
export abstract class NoteElement extends ComponentBase implements EditPathNode {
    getNextEditPathNode(index: UUID): EditPathNode | undefined {
        throw new EndOfEditPathError("NoteElement")
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        throw new EndOfEditPathError("NoteElement")
    }
}