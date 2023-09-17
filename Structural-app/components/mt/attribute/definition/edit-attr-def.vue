<script setup lang="ts">
import { EditPath, Note, AttributeDefinition, AttrTypeHelper, AttrTypeNameAndInstance, AttributeType, InjectConstant } from "structural-core"

const props = defineProps<{
    edit_path: EditPath | null, // edit_path to the AttributeDefinition
}>()

const emit = defineEmits<{
    (event: 'attrTypeUpdate'): void
}>()

const editing_note: Ref<Note> | undefined = ref(inject(InjectConstant.EDITING_NOTE))
const attr_def = editing_note === undefined || props.edit_path === null? ref(null) : ref(props.edit_path.getNodeByPath(editing_note.value) as AttributeDefinition<any>)
const ori_attr_type_name = attr_def.value?.attribute_type?.type ?? null

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
function selectedType(attr_type: AttrTypeNameAndInstance){
    // when user select a type, update the attr_def & push a update type operation in the queue
    if (attr_def.value != null){
        attr_def.value.attribute_type = attr_type.instance
        emit('attrTypeUpdate')
    }
}

const active_tab = ref("basic")
function changeToTab(tab: string){
    active_tab.value = tab
}
</script>

<template>
    <Tabs v-model="active_tab">
        <!-- Tab to choose the attr basic info. -->
        <TabPane label="Basic" name="basic">
            <div v-if="attr_def !== null">
                Name: <Input v-model="attr_def.name" />
                Description: <Input v-model="attr_def.description" />
                Optional: <Switch v-model="attr_def.optional" />
            </div>

            <!-- <Button type="primary" @click="changeToTab('constrain')" style="float: right;">Next</Button> -->
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

            <!-- <Button type="primary" @click="changeToTab('basic')" style="float: right;">Next</Button> -->
        </TabPane>

    
        <!-- <TabPane label="Type Basic" name="type-basic">
            one component for each type
        </TabPane> -->

        <!-- <TabPane label="Advance" name="advance">
        </TabPane> -->
    </Tabs>
</template>