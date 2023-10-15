import { ConstrainType, EditPathNode, Constrain } from "structural-core"
import MtAttributeConstrainMin from "@/components/mt/attribute/constrain/min.vue"
import MtAttributeConstrainMax from "@/components/mt/attribute/constrain/max.vue"
import MtAttributeConstrainRequire from "@/components/mt/attribute/constrain/require.vue"

export type ConstrainChoice = {
    label: string,
    id: string
}

export function constrainChoiceMapper(constrain_type: ConstrainType): ConstrainChoice | null {
    return {
        label: constrain_type,
        id: constrain_type
    }
}

export function definedConstrainMapper(child: EditPathNode){
    switch ((child as Constrain).getType()){
        case ConstrainType.REQUIRE:
            return MtAttributeConstrainRequire
        case ConstrainType.MIN:
            return MtAttributeConstrainMin
        case ConstrainType.MAX:
            return MtAttributeConstrainMax
    }
}