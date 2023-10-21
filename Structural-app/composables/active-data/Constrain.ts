import { ConstrainType, type EditPathNode, Constrain, EditPath, AttributeDefinition, ArrayUtil } from "structural-core"
import MtAttributeConstrainMin from "@/components/mt/attribute/constrain/min.vue"
import MtAttributeConstrainMax from "@/components/mt/attribute/constrain/max.vue"
import MtAttributeConstrainRequire from "@/components/mt/attribute/constrain/require.vue"

export type AttrConstrainEditComponent = {
    id: string,
    label: string,
    path: EditPath | null,
    component_type: any,
    constrain_type: ConstrainType,
}

export function getAttrConstrainEditComponents(attr_def_edit_path: EditPath, attr_def: AttributeDefinition<any>): Map<ConstrainType, AttrConstrainEditComponent> {
    let attr_constrain_edit_components: Map<ConstrainType, AttrConstrainEditComponent> = new Map()
    
    // map each defined constrain to a components
    attr_def.constrains.forEach((constrain, constrain_id) => {
        let constrain_type = constrain.getType()
        
        let component = {
            id: constrain_id,
            label: constrain_type,
            path: attr_def_edit_path.clone().append(constrain_id),
            component_type: markRaw(definedConstrainMapper(constrain_type)),
            constrain_type: constrain_type,
        }
        
        attr_constrain_edit_components.set(constrain_type, component)
    })
    
    // filter the available constrains
    let available_constrains = attr_def.getAvailableConstrains()
    available_constrains.forEach((constrain_type) => {
        // not defined => create a new component
        let component = {
            id: attr_def + "_" + constrain_type,
            label: constrain_type,
            path: null,
            component_type: markRaw(definedConstrainMapper(constrain_type)),
            constrain_type: constrain_type,
        }
        attr_constrain_edit_components.set(constrain_type, component)
    })
    return attr_constrain_edit_components
}

function definedConstrainMapper(type: ConstrainType){
    switch (type){
        case ConstrainType.REQUIRE:
        case ConstrainType.REGEX:
        case ConstrainType.UNIQUE:
            return MtAttributeConstrainRequire
        case ConstrainType.MIN:
            return MtAttributeConstrainMin
        case ConstrainType.MAX:
            return MtAttributeConstrainMax
    }
    throw new Error("ConstrainType not defined: " + type)
}

const ungrouped_type_order = [
    ConstrainType.REQUIRE,
    ConstrainType.UNIQUE,
    ConstrainType.MIN,
    ConstrainType.MAX,
    ConstrainType.REGEX,
]

const grouped_type = [
    [ConstrainType.MIN, ConstrainType.MAX],
]

export function getGroupedAttrConstrain(constrains: Map<ConstrainType, AttrConstrainEditComponent>): AttrConstrainEditComponent[][] {
    let grouped: AttrConstrainEditComponent[][] = []
    
    // for each grouped type
    grouped_type.forEach((group) => {
        let group_components: AttrConstrainEditComponent[] = []
        group.forEach((type) => {
            if (constrains.has(type)){
                group_components.push(constrains.get(type)!)
            }
        })
        if (group_components.length == 2){
            // both constrains are defined, add them to the grouped list
            grouped.push(group_components)
            // remove them from the constrains map
            group_components.forEach((component) => {
                constrains.delete(component.constrain_type)
            })
        }
    })

    // add all ungrouped constrains
    let ungrouped: AttrConstrainEditComponent[] = []
    ungrouped_type_order.forEach((type) => {
        if (constrains.has(type)){
            ungrouped.push(constrains.get(type)!)
        }
    })

    let ungrouped_group: AttrConstrainEditComponent[][] = ArrayUtil.group(ungrouped, 2, null)
    grouped = ungrouped_group.concat(grouped)
    return grouped
}