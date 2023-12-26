<script setup lang="ts">
import { EditPath, AttributeDefinition, AttrTypeHelper, AttributeType, ConstraintTypeToClassMap, ValidOperationResult } from "structural-core"
import { getAttrConstraintEditComponents, type AttrConstraintEditComponent, getGroupedAttrConstraint } from "@/composables/active-data/Constraint"
import { tran } from "~/composables/app/translate"

const props = defineProps<{
    attr_def: AttributeDefinition<any>,
    render: number
}>()

const emit = defineEmits<{
    (event: 'attrTypeUpdate', new_attr_def: AttributeDefinition<any> | null): void
}>()

// # view
const active_tab = ref("basic")
watch(active_tab, () => {
})

// # base
let attr_def = props.attr_def

// # reload (after attr type changed)
const reload_done = ref(0)
watch(() => props.render, () => {
    attr_types_that_can_be_set.value = getAllTypes()
    current_attr_type_name.value = attr_def.attribute_type?.type || ""
    // default_value.value = attr_def.default_value_for_attr
    reload_done.value += 1
})

// # attr type
const init_attr_type_mode = ref(attr_def.attribute_type === null? true : false)
const constraint_changed_count = ref(0)
const current_attr_type_name: Ref<string> = ref(attr_def.attribute_type?.type || "")
const attr_type_can_be_changed = ref(true)
const attr_types_that_can_be_set = shallowRef(getAllTypes())

// for determining if the attr has type => show advance option tabs
const attr_has_type = computed(() => {
    return current_attr_type_name.value !== ""
})

// Get all the attribute types that this attribute definition can be changed to.
function getAllTypes(){
    if (!init_attr_type_mode.value){
        // existing attr, type can only be changed to convertible types
        let ori_attr_type = AttributeType.getAttrType(current_attr_type_name.value)
        if (ori_attr_type !== undefined){ 
            let types = AttrTypeHelper.getGroupedConvertibleTypes(ori_attr_type, 2, null)
            if (types.length === 0){
                attr_type_can_be_changed.value = false
            }
            return types
        }
    } else {
        // new attr
        return AttrTypeHelper.getGroupedTypes(2, null)
    }
}

// when user select a type, update the attr_def & push a update type operation in the queue
function selectedType(attr_type: AttributeType<any>){
    current_attr_type_name.value = attr_type.type
    if (attr_def.attribute_type !== null){
        // has old type
        let new_attr_def = AttributeDefinition.convertToType(attr_def, attr_type)
        emit('attrTypeUpdate', new_attr_def)   
    } else {
        // init attr type
        attr_def.attribute_type = attr_type
        init_attr_type_mode.value = false
        emit('attrTypeUpdate', null)
    }
    constraint_changed_count.value += 1
}

// # constraints
// render the constraints
const available_constraints: Ref<AttrConstraintEditComponent[][]> = ref([])
watch([reload_done, constraint_changed_count], () => {
    // get the available constraints from the attr_def
    let constraints = getAttrConstraintEditComponents(new EditPath(), attr_def)
    available_constraints.value = getGroupedAttrConstraint(constraints)
}, { immediate: true })

function onConstraintStatusChange(is_set: boolean, params: AttrConstraintEditComponent){
    if (is_set){
        if (!attr_def.constraints.has(params.id)){
            // add constrain
            let constraint = ConstraintTypeToClassMap.get(params.constraint_type)
            if (constraint !== undefined){
                let new_constraint = new constraint()
                attr_def.addConstraint(new_constraint)                
            }
        }
    } else {
        // remove constrain
        attr_def.removeConstraint(params.id)
    }
    constraint_changed_count.value += 1
}

// # default value
const has_default_value = computed({
    get: () => {
        return attr_def.explicit_default_value !== null
    },
    set: (has_default_value) => {
        if (has_default_value){
            default_value.value = attr_def.default_value_for_attr
        } else {
            default_value.value = null
        }
    }
})
const default_value_validate_result = ref(ValidOperationResult)
const default_value = computed({
    get: () => attr_def.default_value_for_attr,
    set: (v) => { 
        default_value_validate_result.value = attr_def.setDefaultValue(v)
        console.log("setDefaultValue", attr_def.explicit_default_value)
    }
})

</script>

<template>
    <Tabs v-model="active_tab">
        <!-- Tab to choose the attr basic info. -->
        <TabPane :label="tran('structural.struct_def.edit_attr_basic_tab_title')" name="basic">
            <Form label-position="top" v-if="attr_def !== null">
                <FormItem :label="tran('structural.struct_def.edit_attr_basic_name_label')" prop="name">
                    <Input v-model="attr_def.name" />
                </FormItem>
                <FormItem :label="tran('structural.struct_def.edit_attr_basic_description_label')" prop="description">
                    <Input v-model="attr_def.description" />
                </FormItem>
            </Form>
        </TabPane>

        <!-- Tab to choose the attr type. -->
        <TabPane :label="tran('structural.struct_def.edit_attr_type_tab_title')" name="type">
            <!-- prompt -->
            <!-- No existing attr type -->
            <template v-if="init_attr_type_mode">
                {{ tran('structural.struct_def.edit_attr_choose_type_label') }}{{ tran("symbol.colon") }}
            </template>
            <!-- Has existing attr type -->
            <template v-else>
                <!-- Current attr type -->
                <Row>
                    <Col flex="1">
                        {{ tran('structural.struct_def.edit_attr_current_type_label') }}{{ tran("symbol.colon") }}
                    </Col>
                    <Col flex="2">
                        <mt-attribute-definition-attr-type-choice 
                        :attr="attr_def.attribute_type"
                        :readonly_mode="true"
                        />
                    </Col>
                </Row>
                <Divider />
                {{ tran('structural.struct_def.edit_attr_change_to_type_label') }}{{ tran("symbol.colon") }}
            </template>

            <!-- New attr types that can be set / changed to -->
            <div 
                v-if="attr_type_can_be_changed"
                style="width: 100%" 
            >
                <Row v-for="type_group in attr_types_that_can_be_set">
                    <Col flex="1" v-for="attr_type in type_group">
                        <mt-attribute-definition-attr-type-choice 
                            @select="selectedType"
                            :readonly_mode="false"
                            :attr="attr_type"
                        />
                    </Col>
                </Row>
            </div>
            <!-- The attr type is fixed. -->
            <div v-else>{{ tran("structural.struct_def.edit_attr_cannot_be_change") }}</div>
        </TabPane>

        <!-- Tab that only show after the type is set  -->
        <template v-if="attr_has_type">
            <TabPane :label="tran('structural.attribute.constraint.constraint')" name="constraint">
                {{ attr_def.constraints }}
                <Form inline>
                    <!-- Default value editor -->
                    <FormItem prop="default_value_checkbox">
                        <Checkbox v-model="has_default_value" >
                            {{ tran('structural.struct_def.edit_attr_constraint_default_label')  }}
                        </Checkbox>
                    </FormItem>
                    <FormItem prop="default_value" 
                        v-show="has_default_value"
                        :error="default_value_validate_result.invalid_message" >
                        <mt-attribute-value-editor 
                            :type="current_attr_type_name" 
                            v-model:value="default_value" />
                    </FormItem>

                    <!-- Constraints editor -->
                    <Row v-for="group in available_constraints">
                        <Col span="12" v-for="value in group" :key="undefined">
                            <mt-attribute-constraint-base 
                                v-if="value !== null"
                                :params="value"
                                :attr_def="attr_def"
                                :render="constraint_changed_count"
                                @update="onConstraintStatusChange">
                            </mt-attribute-constraint-base>
                        </Col>
                    </Row>
                </Form>
            </TabPane>
        </template>
        <template v-else>
            <!-- Type is not set yet -->
            <TabPane :label="tran('structural.attribute.constraint.constraint')" name="constraint" disabled />
        </template>
    </Tabs>
</template>

<style scoped>
.delete-constraint-button{
    /* align to right */
    float: right;
}
</style>