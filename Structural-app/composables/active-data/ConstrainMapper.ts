import { ConstrainType, EditPathNode, Constrain } from "structural-core"
import MtAttributeConstrainMin from "@/components/mt/attribute/constrain/min.vue"
import MtAttributeConstrainMax from "@/components/mt/attribute/constrain/max.vue"
import MtAttributeConstrainRequire from "@/components/mt/attribute/constrain/require.vue"

export type ConstrainChoice = {
    label: string,
    id: number
}

export function constrainChoiceMapper(constrain_type: ConstrainType): ConstrainChoice | null {
    switch(constrain_type){
        case ConstrainType.REQUIRE:
            return {
                label: "Require",
                id: constrain_type
            }
    }
    return null
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