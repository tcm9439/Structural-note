import { Note, EditPathNode, EditPath, InjectConstant } from "structural-core"

export function activeDataGetter(editing_note: Note | undefined, edit_path: EditPath | null): EditPathNode | null {
    if(editing_note === undefined || edit_path === null) {
        return null
    } else {
        return edit_path.getNodeByPath(editing_note)
    }
}
