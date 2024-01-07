import { ConstraintType, EditPath, AttributeDefinition, ArrayUtil, Constraint } from "structural-core"
import MtAttributeConstraintMin from "@/components/mt/attribute/constraint/min.vue"
import MtAttributeConstraintMax from "@/components/mt/attribute/constraint/max.vue"
import MtAttributeConstraintEnum from "@/components/mt/attribute/constraint/enum.vue"
import MtAttributeConstraintRegex from "@/components/mt/attribute/constraint/regex.vue"
import MtAttributeConstraintNoParam from "@/components/mt/attribute/constraint/no-param.vue"
import { tran } from "~/composables/app/translate"

export type AttrConstraintEditComponent = {
    id: string,
    label: string, // label for the form item, translated
    path: EditPath | null,
    component_type: any,
    constraint_type: ConstraintType,
    no_param: boolean,
    shorter_label: boolean,
}

const NO_PARAM_CONSTRAINT = [
    ConstraintType.REQUIRE,
    ConstraintType.UNIQUE,
]

const SHORTER_LABEL_CONSTRAINT = [
    ConstraintType.ENUM,
]

export function getAttrConstraintEditComponents(attr_def_edit_path: EditPath, attr_def: AttributeDefinition<any>): Map<ConstraintType, AttrConstraintEditComponent> {
    let attr_constraint_edit_components: Map<ConstraintType, AttrConstraintEditComponent> = new Map()
    
    // map each defined constraint to a components
    attr_def.constraints.forEach((constraint, constraint_id) => {
        let constraint_type = constraint.getType()
        let component = {
            id: constraint_id,
            label: tran(constraint.getTypeTranslationKey()),
            path: attr_def_edit_path.clone().append(constraint_id),
            component_type: markRaw(constraintMapper(constraint_type)),
            constraint_type: constraint_type,
            no_param: isNoParamConstraint(constraint_type),
            shorter_label: withShorterLabel(constraint_type),
        }
        
        attr_constraint_edit_components.set(constraint_type, component)
    })
    
    // add the available constraints that are not yet added to the attribute definition
    let available_constraints = attr_def.getAvailableConstraints()
    available_constraints.forEach((constraint_type) => {
        let component = {
            id: attr_def + "_" + constraint_type,
            label: tran(Constraint.getTypeTranslationKeyForType(constraint_type)),
            path: null,
            component_type: markRaw(constraintMapper(constraint_type)),
            constraint_type: constraint_type,
            no_param: isNoParamConstraint(constraint_type),
            shorter_label: withShorterLabel(constraint_type),
        }
        attr_constraint_edit_components.set(constraint_type, component)
    })
    return attr_constraint_edit_components
}

function constraintMapper(type: ConstraintType){
    switch (type){
        case ConstraintType.MIN:
            return MtAttributeConstraintMin
        case ConstraintType.MAX:
            return MtAttributeConstraintMax
        case ConstraintType.REQUIRE:
        case ConstraintType.UNIQUE:
            return MtAttributeConstraintNoParam
        case ConstraintType.REGEX:
            return MtAttributeConstraintRegex
        case ConstraintType.ENUM:
            return MtAttributeConstraintEnum
    }
    throw new Error("ConstraintType not defined: " + type)
}

function isNoParamConstraint(type: ConstraintType){
    return NO_PARAM_CONSTRAINT.includes(type)
}

function withShorterLabel(type: ConstraintType){
    return SHORTER_LABEL_CONSTRAINT.includes(type)
}

const ungrouped_type_order = [
    ConstraintType.ENUM,
    ConstraintType.REQUIRE,
    ConstraintType.UNIQUE,
    ConstraintType.MIN,
    ConstraintType.MAX,
    ConstraintType.REGEX,
]

const grouped_type = [
    [ConstraintType.MIN, ConstraintType.MAX],
]

export function getGroupedAttrConstraint(constraints: Map<ConstraintType, AttrConstraintEditComponent>): AttrConstraintEditComponent[][] {
    let grouped: AttrConstraintEditComponent[][] = []
    
    // for each grouped type
    grouped_type.forEach((group) => {
        let group_components: AttrConstraintEditComponent[] = []
        group.forEach((type) => {
            if (constraints.has(type)){
                group_components.push(constraints.get(type)!)
            }
        })
        if (group_components.length == 2){
            // both constraints are defined, add them to the grouped list
            grouped.push(group_components)
            // remove them from the constraints map
            group_components.forEach((component) => {
                constraints.delete(component.constraint_type)
            })
        }
    })

    // add all ungrouped constraints
    let ungrouped: AttrConstraintEditComponent[] = []
    ungrouped_type_order.forEach((type) => {
        if (constraints.has(type)){
            ungrouped.push(constraints.get(type)!)
        }
    })

    let ungrouped_group: AttrConstraintEditComponent[][] = ArrayUtil.group(ungrouped, 2, null)
    grouped = ungrouped_group.concat(grouped)
    return grouped
}