<script setup lang="ts">
import { EditPath, AttributeDefinition, AttrTypeHelper, AttributeType, ConstraintTypeToClassMap, ValidOperationResult, AppState } from "@structural-note/structural-core"
import { getAttrConstraintEditComponents, type AttrConstraintEditComponent, getGroupedAttrConstraint } from "@/composables/active-data/Constraint"
import { tran } from "~/composables/app/translate"

const props = defineProps<{
    ori_attr_def: AttributeDefinition<any> | null,  // the attr def when the edit-struct-def modal is opened
    attr_def: AttributeDefinition<any>,             // the current attr def (may be changed when last edit this attr)
    render: number
}>()

const emit = defineEmits<{
    (event: 'attrTypeUpdate', new_attr_def: AttributeDefinition<any> | null): void
}>()

// # view
const active_tab = ref("basic")

// # reload (after attr type changed)
const reload_done = ref(0)
watch(() => props.render, () => {
    attr_types_that_can_be_set.value = getAvailableType()
    reload_done.value += 1
})

// # attr type
const constraint_changed_count = ref(0)
const current_attr_type = computed(() => props.attr_def.attribute_type) // AttributeType<any> | null
const ori_attr_type = getOriAttrType() // AttributeType<any> | null, unchange after init
const attr_types_that_can_be_set = shallowRef(getAvailableType())

// for determining if the attr has type => show advance option tabs
const attr_has_type = computed(() => {
    return current_attr_type.value !== null
})

function getOriAttrType(){
    if (props.ori_attr_def === null){
        // new attr => return current type
        return current_attr_type.value
    } else {
        return props.ori_attr_def.attribute_type
    }
}

// Get all the attribute types that this attribute definition can be changed to.
function getAvailableType(){
    let current_choice: string | null = current_attr_type.value?.type ?? null
    if (ori_attr_type === null){
        // new attr, can choose any types
        return AttrTypeHelper.getGroupedTypes(current_choice, 2, null)
    } else {
        // type can only be changed to convertible types
        let types = AttrTypeHelper.getGroupedConvertibleTypes(ori_attr_type, current_choice, 2, null)
        return types
    }
}

// when user select a type, update the attr_def & push a update type operation in the queue
function selectedType(attr_type: AttributeType<any>){
    AppState.logger.trace(`User select attr type ${attr_type.type}`)
    if (props.attr_def.attribute_type !== null){
        // has old type
        let new_attr_def = AttributeDefinition.convertToType(props.attr_def, attr_type)
        emit('attrTypeUpdate', new_attr_def)   
    } else {
        // init attr type
        props.attr_def.attribute_type = attr_type
        emit('attrTypeUpdate', null)
    }
    constraint_changed_count.value += 1
}

// # constraints
// render the constraints
const available_constraints: Ref<AttrConstraintEditComponent[][]> = ref([])
watch([reload_done, constraint_changed_count], () => {
    // get the available constraints from the attr_def
    let constraints = getAttrConstraintEditComponents(new EditPath(), props.attr_def)
    available_constraints.value = getGroupedAttrConstraint(constraints)
}, { immediate: true })

function onConstraintStatusChange(is_set: boolean, params: AttrConstraintEditComponent){
    if (is_set){
        if (!props.attr_def.constraints.has(params.id)){
            // add constrain
            let constraint = ConstraintTypeToClassMap.get(params.constraint_type)
            if (constraint !== undefined){
                let new_constraint = new constraint()
                props.attr_def.addConstraint(new_constraint)                
            }
        }
    } else {
        // remove constrain
        props.attr_def.removeConstraint(params.id)
    }
    constraint_changed_count.value += 1
}

// # default value
const has_default_value = computed({
    get: () => {
        return props.attr_def.explicit_default_value !== null
    },
    set: (has_default_value) => {
        if (has_default_value){
            default_value.value = props.attr_def.default_value_for_attr
        } else {
            default_value.value = null
        }
    }
})
const default_value_validate_result = ref(ValidOperationResult)
const default_value = computed({
    get: () => props.attr_def.default_value_for_attr,
    set: (v) => default_value_validate_result.value = props.attr_def.setDefaultValue(v)
})

</script>

<template>
    <Tabs v-model="active_tab">
        <!-- Tab to choose the attr basic info. -->
        <TabPane :label="tran('structural.struct_def.edit_attr_basic_tab_title')" name="basic">
            <Form label-position="top" v-if="attr_def !== null" @submit.prevent>
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
            <div class="mt-label">
                {{ tran('structural.struct_def.edit_attr_choose_type_label') }}{{ tran("symbol.colon") }}
            </div>

            <!-- New attr types that can be set / changed to -->
            <div class="mt-attr-type-choice-list" >
                <Row v-for="type_group in attr_types_that_can_be_set">
                    <Col flex="1" v-for="attr_type in type_group">
                        <mt-attribute-definition-attr-type-choice 
                            v-if="attr_type !== null"
                            @select="selectedType"
                            :attr="attr_type.type"
                            :chosen="attr_type.chosen"
                        />
                    </Col>
                </Row>
            </div>
        </TabPane>

        <!-- Tab that only show after the type is set  -->
        <template v-if="attr_has_type">
            <TabPane :label="tran('structural.attribute.constraint.constraint')" name="constraint">
                <Form inline @submit.prevent>
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
                            :type="current_attr_type?.type ?? ''" 
                            :attr_def="attr_def"
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

.mt-label {
    line-height: 30px;
    height: 30px;
}

.mt-attr-type-choice-list {
    width: 100%;
}
</style>