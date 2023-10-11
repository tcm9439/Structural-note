import { EditPathNode, StructuralElement, TextElement } from "structural-core"
import MtElementText from "@/components/mt/element/text.vue"
import MtElementStructural from "@/components/mt/element/structural.vue"

export function elementComponentMapper(child: EditPathNode){
    if (child instanceof StructuralElement){
        return MtElementStructural
    } else if (child instanceof TextElement){
        return MtElementText
    }
}