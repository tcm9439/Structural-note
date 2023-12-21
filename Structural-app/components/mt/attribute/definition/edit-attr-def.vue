<script setup lang="ts">
import { EditPath, Note, AttributeDefinition, AttrTypeHelper, AttrTypeNameAndInstance, AttributeType, ConstrainTypeToClassMap, ValidOperationResult, ConstrainType } from "structural-core"
import { getAttrConstrainEditComponents, type AttrConstrainEditComponent, getGroupedAttrConstrain } from "@/composables/active-data/Constrain"

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
    constrain_changed_count.value += 1
}

// # constrains
// render the constrains
const available_constrains: Ref<AttrConstrainEditComponent[][]> = ref([])
watch([reload_done, constrain_changed_count], () => {
    // get the available constrains from the attr_def
    let constrains = getAttrConstrainEditComponents(new EditPath(), attr_def)
    available_constrains.value = getGroupedAttrConstrain(constrains)
}, { immediate: true })

function onConstrainStatusChange(is_set: boolean, params: AttrConstrainEditComponent){
    if (is_set){
        if (!attr_def.constrains.has(params.id)){
            // add constrain
            let constrain = ConstrainTypeToClassMap.get(params.constrain_type)
            if (constrain !== undefined){
                let new_constrain = new constrain()
                attr_def.addConstrain(new_constrain)                
            }
        }
    } else {
        // remove constrain
        attr_def.removeConstrain(params.id)
    }
    constrain_changed_count.value += 1
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
            <TabPane label="Constrain" name="constrain">
                {{ attr_def }}
                <Form inline>
                    <!-- Default value editor -->
                    <FormItem prop="default_value_checkbox">
                        <Checkbox v-model="has_default_value" >
                            Default value
                        </Checkbox>
                    </FormItem>
                    <FormItem prop="default_value" 
                        v-show="has_default_value"
                        :error="default_value_validate_result.invalid_message" >
                        <mt-attribute-value-editor 
                            :type="current_attr_type_name" 
                            v-model:value="default_value" />
                    </FormItem>

                    <!-- Constrains editor -->
                    <Row v-for="group in available_constrains">
                        <Col span="12" v-for="value in group" :key="undefined">
                            <mt-attribute-constrain-base 
                                v-if="value !== null"
                                :params="value"
                                :attr_def="attr_def"
                                :render="constrain_changed_count"
                                @update="onConstrainStatusChange">
                            </mt-attribute-constrain-base>
                        </Col>
                    </Row>
                </Form>
            </TabPane>
        </template>
        <template v-else>
            <!-- Type is not set yet -->
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