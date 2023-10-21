<script setup lang="ts">
import { EditPath, Note, StructureDefinition, EventConstant, StructDefEditContext, StructDefEditState, StructDefEditEvent, InjectConstant, AttributeDefinition } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { Icon } from "view-ui-plus"
const { $Message } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureDefinition
    edit_def_mode: boolean
}>()

const emit = defineEmits<{
    (event: 'update:edit_def_mode', visible: boolean): void
}>()
const { $emitter } = useNuxtApp()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const struct_def = activeDataGetter(editing_note, props.edit_path) as StructureDefinition

const edit_context = ref(new StructDefEditContext(struct_def, onExitEditStruct)) as Ref<StructDefEditContext>
const edit_state = computed(() => edit_context.value.state)
const struct_has_change = computed(() => edit_context.value.edit_queue.hasConfirmedItem())

// # error modal
const show_error_modal = ref(false)
const error_title = ref("")
const error_content = ref("")

let attr_def_edit_path: Ref<EditPath | null> = ref(null)
function setAttrToEdit(id: string){
    attr_def_edit_path.value = props.edit_path.clone().append(id)
}

function showInvalidDefinitionMessage(def_type: string, error_msg: string){
    show_error_modal.value = true
    error_title.value = `Invalid ${def_type} Definition`
    error_content.value = error_msg
}

function onErrorModalConfirm(){
    show_error_modal.value = false
}

function onExitEditStruct(has_change: boolean){
    if (has_change){
        // there is changes to the def
        $emitter.emit(EventConstant.ATTR_DEF_UPDATE, edit_context.value.edit_queue)
        $Message.info("Update Definition")
    } else {
        $Message.info("Cancel")
    }
    // close this modal
    emit('update:edit_def_mode', false)
}

function startAddAttr() {
    let new_id = StructDefEditEvent.startAddAttr(edit_context.value)
    setAttrToEdit(new_id)
}

function startEditAttr(id: string) {
    StructDefEditEvent.startEditAttr(edit_context.value, id)
    setAttrToEdit(id)
}

function deleteAttr(id: string) {
    StructDefEditEvent.deleteAttr(edit_context.value, id)
}

function confirmEditAttr() {
    let result = StructDefEditEvent.confirmEditAttr(edit_context.value)
    if (result?.valid === false){
        showInvalidDefinitionMessage("Attribute", result.invalid_message)
    }
}

function cancelEditAttr() {
    StructDefEditEvent.cancelEditAttr(edit_context.value)
}

function confirmStructDef(){
    let result = StructDefEditEvent.confirmEditStruct(edit_context.value)
    if (result?.valid === false){
        showInvalidDefinitionMessage("Section", result.invalid_message)
    }
}

function cancelEditStruct() {
    StructDefEditEvent.cancelEditStruct(edit_context.value)
}

const render_attr_def = ref(0)
function attrTypeUpdate(attr_def: AttributeDefinition<any> | null){
    if (attr_def !== null){
        // change the ori attr type
        StructDefEditEvent.attrTypeUpdate(edit_context.value, attr_def)
    }
    // else a init attr type is set

    // re-render the attr def
    render_attr_def.value += 1
}

</script>

<template>
    <Modal
        :modelValue="props.edit_def_mode"
        title="Section Definition"
        :closable="false"
        :mask-closable="false"
        width="85"
    >

        <!-- Attributes list -->
        <div v-if="edit_state === StructDefEditState.EDITING_STRUCT">
            <mt-attribute-definition-edit-defined-attrs-table
                @create="startAddAttr" 
                @delete="deleteAttr"
                @edit="startEditAttr"
                :edit_path="edit_path" />
        </div>

        <!-- Edit one of the attribute -->
        <div v-if="edit_state === StructDefEditState.EDITING_ATTR && attr_def_edit_path != null">
            <mt-attribute-definition-edit-attr-def 
                @attrTypeUpdate="attrTypeUpdate"
                :edit_path="attr_def_edit_path" 
                :render="render_attr_def"
            />
        </div>

        <!-- Confirm / Cancel Button -->
        <template #footer>
            <!-- The button set for the whole struct def -->
            <div v-show="edit_state === StructDefEditState.EDITING_STRUCT">
                <!-- Cancel button is always show & is the only way to close this Modal -->
                <Button @click="cancelEditStruct">
                    Cancel
                </Button>

                <!-- If no change is done, don't allow user to click the confirm button. -->
                <Button type="primary" @click="confirmStructDef" v-show="struct_has_change">
                    Confirm
                </Button>
                <Button type="primary" disabled v-show="!struct_has_change">
                    Confirm
                </Button>
            </div>

            <!-- The button set for the selected editing attr def -->
            <div v-show="edit_state === StructDefEditState.EDITING_ATTR">
                <Button @click="cancelEditAttr">
                    Cancel
                </Button>
    
                <Button type="primary" @click="confirmEditAttr">
                    Confirm
                </Button>
            </div>
        </template>

        <Modal 
            :modelValue="show_error_modal"
            :closable="false"
            :mask-closable="false"
            class-name="vertical-center-modal"
        >
            <template #header>
                <Icon type="md-alert" color="red" />
                {{ error_title }}
            </template>
            {{ error_content }}

            <template #footer>
                <Button type="primary" @click="onErrorModalConfirm">
                    Confirm
                </Button>
            </template>
        </Modal>
    </Modal>
</template>
