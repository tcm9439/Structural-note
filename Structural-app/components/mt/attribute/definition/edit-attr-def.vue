<script setup lang="ts">
import { EditPath, Note, AttributeDefinition, AttrTypeHelper, AttrTypeNameAndInstance, AttributeType, InjectConstant, Constrain } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the AttributeDefinition
}>()

const emit = defineEmits<{
    (event: 'attrTypeUpdate', new_attr_def: AttributeDefinition<any>): void
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const attr_def = activeDataGetter(editing_note, props.edit_path) as AttributeDefinition<any>
const ori_attr_type_name = attr_def.attribute_type?.type ?? null

const attr_type_can_be_changed = ref(true)
/**
 * Get all the attribute types that this attribute definition can be changed to.
 */
function getAllTypes(){
    if (ori_attr_type_name !== null){
        // existing attr, type can only be changed to convertible types
        let ori_attr_type = AttributeType.getAttrType(ori_attr_type_name)
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

const attr_type: Ref<string> = ref("")
// when user select a type, update the attr_def & push a update type operation in the queue
function selectedType(attr_type: AttrTypeNameAndInstance){
    if (attr_def !== null){
        // attr_def.value.attribute_type = attr_type.instance
        let new_attr_def = AttributeDefinition.convertToType(attr_def, attr_type.instance)
        emit('attrTypeUpdate', new_attr_def)
    }
}

const active_tab = ref("basic")
// function changeToTab(tab: string){
//     active_tab.value = tab
// }

// Constrains
const available_constrains: Ref<Constrain[]> = ref([])
const selected_new_constrain: Ref<string | null> = ref(null)
function addNewConstrain(){

}
const added_constrains: Ref<Constrain[]> = ref([])
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
            Choose Attribute Type:
            <RadioGroup type="button" v-model="attr_type" style="width: 100%" v-if="attr_type_can_be_changed">
                <Row v-for="type_group in getAllTypes()">
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

    
        <TabPane label="Constrain" name="constrain">
            <Select v-model="selected_new_constrain" clearable style="width:200px">
                <Option v-for="item in available_constrains" :value="item.value" :key="item.value">
                    {{ item.label }}
                </Option>
            </Select>
            <Button @clikc="addNewConstrain">
                <Icon type="md-add" />
                Add
            </Button>
            <Divider />
            <Form inline label-position="top">
                <template v-for="value in added_constrains" :key="value.id">
                    <component :is='added_constrains.type' :edit_path="value.path" />
                </template>
            </Form>
        </TabPane>
    </Tabs>
</template>