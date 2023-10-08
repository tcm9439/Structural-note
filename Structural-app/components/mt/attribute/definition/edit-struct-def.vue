<script setup lang="ts">
import { EditPath, Note, StructureDefinition, EventConstant, StructDefEditContext, StructDefEditState, StructDefEditEvent, InjectConstant, AttributeDefinition } from "structural-core"
const { $Message } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureDefinition
    edit_def_mode: boolean
}>()

const emit = defineEmits<{
    (event: 'update:edit_def_mode', visible: boolean): void
}>()
const { $emitter } = useNuxtApp()

const editing_note: Ref<Note> | undefined = ref(inject(InjectConstant.EDITING_NOTE))
const struct_def = editing_note === undefined? ref(null) : ref(props.edit_path.getNodeByPath(editing_note.value) as StructureDefinition)

const edit_context = ref(new StructDefEditContext(struct_def.value, onExitEditStruct))
const edit_state = computed(() => edit_context.value.state)
const struct_has_change = computed(() => edit_context.value.edit_queue.hasConfirmedItem())

let attr_def_edit_path: Ref<EditPath | null> = ref(null)
function setAttrToEdit(id: string){
    attr_def_edit_path.value = props.edit_path.clone().append(id)
}

function onExitEditStruct(has_change: boolean){
    console.log(struct_def.value)
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
    StructDefEditEvent.confirmEditAttr(edit_context.value)
}

function cancelEditAttr() {
    StructDefEditEvent.cancelEditAttr(edit_context.value)
}

function confirmStructDef(){
    StructDefEditEvent.confirmEditStruct(edit_context.value)
}

function cancelEditStruct() {
    StructDefEditEvent.cancelEditStruct(edit_context.value)
}

function attrTypeUpdate(attr_def: AttributeDefinition<any>){
    StructDefEditEvent.attrTypeUpdate(edit_context.value, attr_def)
}

</script>

<template>
    <Modal
        :modelValue="props.edit_def_mode"
        title="Section Definition"
        :closable="false"
        width="85">

        <!-- <template #header>
            Section Definition
        </template> -->

        <div v-if="edit_state === StructDefEditState.EDITING_STRUCT">
            <mt-attribute-definition-defined-attr-list 
                @create="startAddAttr" 
                @delete="deleteAttr"
                @edit="startEditAttr"
                :edit_path="edit_path" />
        </div>
        <div v-if="edit_state === StructDefEditState.EDITING_ATTR">
            <mt-attribute-definition-edit-attr-def 
                @attrTypeUpdate="attrTypeUpdate"
                :edit_path="attr_def_edit_path" />
        </div>

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
    </Modal>
</template>