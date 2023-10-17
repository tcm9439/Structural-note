<script setup lang="ts">
import { EditPath, Note, AttributeDefinition, AttrTypeHelper, AttrTypeNameAndInstance, AttributeType, InjectConstant, ConstrainTypeToClassMap, ComponentVForElement, ValidValidateResult } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter } from "@/composables/active-data/ElementListGetter"
import { constrainChoiceMapper, ConstrainChoice, definedConstrainMapper } from "@/composables/active-data/ConstrainMapper"
import { Icon } from "view-ui-plus"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the AttributeDefinition
    render: number
}>()

const emit = defineEmits<{
    (event: 'attrTypeUpdate', new_attr_def: AttributeDefinition<any> | null): void
}>()

// # view
const active_tab = ref("basic")
watch(active_tab, () => {
    selected_new_constrain.value = null
})

// # base
const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
let attr_def = activeDataGetter(editing_note, props.edit_path) as AttributeDefinition<any>

// # reload (after attr type changed)
const reload_done = ref(0)
watch(() => props.render, () => {
    attr_def = activeDataGetter(editing_note, props.edit_path) as AttributeDefinition<any>
    attr_types_that_can_be_set.value = getAllTypes()
    current_attr_type_name.value = attr_def.attribute_type?.type || ""
    default_value.value = attr_def.default_value
    reload_done.value += 1
})

// # attr type
const init_attr_type_mode = ref(attr_def.attribute_type === null? true : false)
const constrain_changed_count = ref(0)
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
function selectedType(attr_type: AttrTypeNameAndInstance){
    current_attr_type_name.value = attr_type.name
    if (attr_def.attribute_type !== null){
        // has old type
        let new_attr_def = AttributeDefinition.convertToType(attr_def, attr_type.instance)
        emit('attrTypeUpdate', new_attr_def)
    } else {
        // init attr type
        attr_def.attribute_type = attr_type.instance
        init_attr_type_mode.value = false
        emit('attrTypeUpdate', null)
    }
}

// # constrains
// render the available constrains
const available_constrains: Ref<ConstrainChoice[]> = ref([])
watch([reload_done, constrain_changed_count], () => {
    // get the available constrains from the attr_def
    available_constrains.value = attr_def.getAvailableConstrains().map(constrainChoiceMapper) as ConstrainChoice[]
}, { immediate: true })

// render the defined constrains
const defined_constrains: Ref<ComponentVForElement[]> = ref([])
watch([() => attr_def.constrains.size, reload_done], () => {
    defined_constrains.value = elementListGetter(editing_note, attr_def, props.edit_path, definedConstrainMapper)
}, { immediate: true })

const selected_new_constrain: Ref<any> = ref(null)
function addNewConstrain(){
    if (selected_new_constrain.value !== null){
        let constrain = ConstrainTypeToClassMap.get(selected_new_constrain.value)
        if (constrain !== undefined){
            let new_constrain = new constrain()
            attr_def.constrains.set(new_constrain.id, new_constrain)
            constrain_changed_count.value += 1
            selected_new_constrain.value = null
        }
    }
}

function deleteConstrain(id: string){
    attr_def.constrains.delete(id)
    constrain_changed_count.value += 1
}

// # default value
const has_default_value = ref(attr_def.default_value !== null)
function onToggleDefaultValue(){
    if (!has_default_value.value){
        default_value.value = null
    }
}
const default_value_validate_result = ref(ValidValidateResult)
const default_value = computed({
    get: () => attr_def.default_value,
    set: (v) => { 
        default_value_validate_result.value = attr_def.setDefaultValue(v)
    }
})

</script>

<template>
    <Tabs v-model="active_tab">
        <!-- Tab to choose the attr basic info. -->
        <TabPane label="Basic" name="basic">
            <Form label-position="top" v-if="attr_def !== null">
                <FormItem label="Name" prop="name">
                    <Input v-model="attr_def.name" />
                </FormItem>
                <FormItem label="Description" prop="description">
                    <Input v-model="attr_def.description" />
                </FormItem>
            </Form>
        </TabPane>

        <!-- Tab to choose the attr type. -->
        <TabPane label="Type" name="type">
            <!-- prompt -->
            <!-- No existing attr type -->
            <template v-if="init_attr_type_mode">
                Choose Attribute Type:
            </template>
            <!-- Has existing attr type -->
            <template v-else>
                <!-- Current attr type -->
                <Row>
                    <Col flex="1">
                        Current Attribute Type: 
                    </Col>
                    <Col flex="2">
                        <mt-attribute-definition-attr-type-choice 
                        :attr_name="current_attr_type_name"
                        :readonly_mode="true"
                        />
                    </Col>
                </Row>
                <Divider />
                Change attribute type to:
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
                            :attr_type="attr_type"
                        />
                    </Col>
                </Row>
            </div>
            <!-- The attr type is fixed. -->
            <div v-else>Type cannot be change.</div>
        </TabPane>

        <!-- Tab that only show after the type is set  -->
        <template v-if="attr_has_type">
            <!-- Default value editor -->
            <TabPane label="Default" name="default">
                <Form>
                    <Checkbox v-model="has_default_value" @on-change="onToggleDefaultValue" >
                        Default value
                    </Checkbox>
                <FormItem prop="default_value" :error="default_value_validate_result.invalid_message" >
                    <mt-attribute-value-editor :type="current_attr_type_name" v-model:value="default_value" />
                </FormItem>
                </Form>
            </TabPane>

            <!-- Constrain editor -->
            <TabPane label="Constrain" name="constrain">
                <!-- Adding new constrain -->
                <Select v-model="selected_new_constrain" clearable style="width:200px">
                    <Option v-for="item in available_constrains" :value="item.id" :key="item.id">
                        {{ item.label }}
                    </Option>
                </Select>
                <Button @click="addNewConstrain">
                    <Icon type="md-add" />
                    Add
                </Button>
                <Divider />

                <!-- Defined Constrain -->
                <Form>
                    <Row v-for="value in defined_constrains" :key="value.id">
                        <Col flex="1">
                            <component :is="value.type" :edit_path="value.path" :attr_def="attr_def"/>
                        </Col>
                        <Col flex="1">
                            <Button @click="deleteConstrain(value.id)" class="delete-constrain-button">
                                <Icon type="md-trash" />
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </TabPane>
        </template>
        <template v-else>
            <!-- Type is not set yet -->
            <TabPane label="Default" name="default" disabled />
            <TabPane label="Constrain" name="constrain" disabled />
        </template>
    </Tabs>
</template>

<style scoped>
.delete-constrain-button{
    /* align to right */
    float: right;
}
</style>