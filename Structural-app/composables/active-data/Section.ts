import { type EditPathNode, StructuralSection } from "@structural-note/structural-core"
import MtSectionBase from "@/components/mt/section/base.vue"
import MtSectionStructural from "@/components/mt/section/structural.vue"

export function sectionComponentMapper(child: EditPathNode){
    if (child instanceof StructuralSection){
        return MtSectionStructural
    } else {
        return MtSectionBase
    }
}