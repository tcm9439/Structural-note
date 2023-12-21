import { type ComponentVForElement, EditPath, type EditPathNode, EndOfEditPathError, Note, ElementType, NoteSection, StructuralElement, TextElement, MarkdownElement, StructuralSection, Logger } from "structural-core"
import MtElementText from "@/components/mt/element/text.vue"
import MtElementMarkdown from "@/components/mt/element/markdown.vue"
import MtElementStructural from "@/components/mt/element/structural.vue"

export function elementComponentMapper(child: EditPathNode){
    if (child instanceof StructuralElement){
        return MtElementStructural
    } else if (child instanceof MarkdownElement){
        return MtElementMarkdown
    } else if (child instanceof TextElement){
        return MtElementText
    }
}

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

export type AvailableElementComponent = {
    id: string,
    disable: boolean,
    display_choice: string,
}

export function availableElementComponentGetter(section: NoteSection): AvailableElementComponent[]{
    return section.available_element_types.map((element_type) => {
        let display_choice = ""
        let disable = false
        
        try {

            switch (element_type) {
                case ElementType.TEXT:
                    display_choice = "Add Text Section"
                    break;
                case ElementType.STRUCT:
                    display_choice = "Add Struct Section"
                    let struct_section = section as StructuralSection
                    if (struct_section.definition.attributes.length() == 0){
                        // disable if no attribute is defined
                        disable = true
                    }
                    break;
                case ElementType.MARKDOWN:
                    display_choice = "Add Markdown Section"
                    break;
                default:
                    break;
            }
        } catch (error) {
            Logger.get().error(`Error when getting available element component: ${error}`)
        }

        return {
            id: element_type,
            disable: disable,
            display_choice: display_choice
        }
    })
}