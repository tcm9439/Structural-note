import { ComponentVForElement, EditPath, EditPathNode, EndOfEditPathError, Note, InjectConstant } from "structural-core"

type ChildElementComponentMapper = (child: EditPathNode) => any // DefineComponent

export function elementListGetter(editing_note: Note | undefined, parent_node: EditPathNode | null, parent_edit_path: EditPath, child_element_component_mapper: ChildElementComponentMapper, stepInMode?: number): ComponentVForElement[] {
    if (editing_note == undefined || parent_node == null) {
        return []
    }
    return parent_node.stepInEachChildren(parent_edit_path, stepInMode).reduce((result, child_path) => {
        const child_id = child_path.getLastStep()
        let child = null
        try {
            child = child_path.getNodeByPath(editing_note as EditPathNode)
        } catch (error) {
            if (error instanceof EndOfEditPathError){
                console.log("End of edit path error")
            }
        }
        if (child !== null) {
            let child_component = child_element_component_mapper(child)
            // if child_component is not a sting/number, wrap it with markRaw
            if (typeof child_component !== "string" && typeof child_component !== "number") {
                child_component = markRaw(child_component)
            }
            if (child_component !== null) {
                result.push({
                    id: child_id,
                    path: child_path,
                    type: child_component
                })
            }
        }
        return result
    }, [] as ComponentVForElement[]) ?? []
}