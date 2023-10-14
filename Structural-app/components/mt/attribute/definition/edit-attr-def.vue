<script setup lang="ts">
import { EditPath, Note, AttributeDefinition, AttrTypeHelper, AttrTypeNameAndInstance, AttributeType, InjectConstant, ConstrainTypeToClassMap, ComponentVForElement } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter } from "@/composables/active-data/ElementListGetter"
import { constrainChoiceMapper, ConstrainChoice, definedConstrainMapper } from "@/composables/active-data/ConstrainMapper"

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
const attr_def = activeDataGetter(editing_note, props.edit_path) as AttributeDefinition<any>

// # attr type
const init_attr_type_mode = ref(attr_def.attribute_type === null? true : false)
const new_constrain_added = ref(0)
const attr_type_name: Ref<string> = ref("")
const attr_type_can_be_changed = ref(true)
const attr_types_that_can_be_set = shallowRef(getAllTypes())

// for determining if the attr has type => show advance option tabs
const attr_has_type = computed(() => {
    return attr_type_name.value !== ""
})

// Get all the attribute types that this attribute definition can be changed to.
function getAllTypes(){
    if (!init_attr_type_mode.value){
        let ori_attr_type_name = attr_def.attribute_type?.type as string
        // existing attr, type can only be changed to convertible types
        let ori_attr_type = AttributeType.getAttrType(ori_attr_type_name)
        attr_type_name.value = ori_attr_type_name
        if (ori_attr_type !== undefined){ 
            let types = AttrTypeHelper.getGroupedConvertibleTypes(ori_attr_type, 2, null)
            if (types.length === 0){
                attr_type_can_be_changed.value = false
            }
            return types
        }
    }
    // new attr
    return AttrTypeHelper.getGroupedTypes(2, null)
}

// when user select a type, update the attr_def & push a update type operation in the queue
function selectedType(attr_type: AttrTypeNameAndInstance){
    if (attr_def.attribute_type !== null){
        // has old type
        let new_attr_def = AttributeDefinition.convertToType(attr_def, attr_type.instance)
        emit('attrTypeUpdate', new_attr_def)
    } else {
        // init attr type
        attr_def.attribute_type = attr_type.instance
        init_attr_type_mode.value = false
        attr_types_that_can_be_set.value = getAllTypes()
        emit('attrTypeUpdate', null)
    }
}

// # constrains
// render the available constrains
const available_constrains: Ref<ConstrainChoice[]> = ref([])
watch([() => props.render, attr_type_name, new_constrain_added], () => {
    if (init_attr_type_mode.value){
        // load the available constrains for the new attr
        let attr_type = AttributeType.getAttrType(attr_type_name.value)
        available_constrains.value = attr_type?.available_constraints.map(constrainChoiceMapper) as ConstrainChoice[] ?? []
    } else {
        // get the available constrains from the attr_def
        available_constrains.value = attr_def.getAvailableConstrains().map(constrainChoiceMapper) as ConstrainChoice[]
    }
}, { immediate: true })

// render the defined constrains
const defined_constrains: Ref<ComponentVForElement[]> = ref([])
watch(() => attr_def.constrains.size, () => {
    defined_constrains.value = elementListGetter(editing_note, attr_def, props.edit_path, definedConstrainMapper)
}, { immediate: true })

const selected_new_constrain: Ref<number | null> = ref(null)
function addNewConstrain(){
    if (selected_new_constrain.value !== null){
        let constrain = ConstrainTypeToClassMap.get(selected_new_constrain.value)
        if (constrain !== undefined){
            let new_constrain = new constrain()
            attr_def.constrains.set(new_constrain.id, new_constrain)
            new_constrain_added.value += 1
            selected_new_constrain.value = null
        }
    }
}

</script>

<template>
    <Tabs v-model="active_tab">
        <!-- Tab to choose the attr basic info. -->
        <TabPane label="Basic" name="basic">
            <Form inline label-position="top" v-if="attr_def !== null">
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
            <template v-if="init_attr_type_mode">
                Choose Attribute Type:
            </template>
            <template v-else>
                <p>
                    Current Attribute Type: {{ attr_def.attribute_type?.type }}
                </p>
                Change attribute type to:
            </template>
            <RadioGroup type="button" v-model="attr_type_name" style="width: 100%" v-if="attr_type_can_be_changed">
                <Row v-for="type_group in attr_types_that_can_be_set">
                    <Col flex="1" v-for="attr_type in type_group">
                        <mt-attribute-definition-attr-type-choice 
                            @select="selectedType"
                            :attr_type="attr_type"
                        />
                    </Col>
                </Row>
            </RadioGroup>
            <div v-else>Type cannot be change.</div>
        </TabPane>

        <template v-if="attr_has_type">
            <TabPane label="Default" name="default">
                TODO default value editor
            </TabPane>
            <TabPane label="Constrain" name="constrain">
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
                <Form>
                    <template v-for="value in defined_constrains" :key="value.id">
                        <component :is="value.type" :edit_path="value.path" />
                    </template>
                </Form>
            </TabPane>
        </template>
        <template v-else>
            <TabPane label="Default" name="default" disabled />
            <TabPane label="Constrain" name="constrain" disabled />
        </template>
    </Tabs>
</template>