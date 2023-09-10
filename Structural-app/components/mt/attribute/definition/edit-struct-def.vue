<script setup lang="ts">
import { EditPath, Note, StructureDefinition, AttributeDefinition, StringAttribute, StructDefEditContext, StructDefEditState, StructDefEditEvent } from "structural-core"
const { $Message } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureDefinition
    edit_def_mode: boolean
}>()

const emit = defineEmits<{
    (event: 'update:edit_def_mode', visible: boolean): void
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const struct_def = editing_note === undefined? ref(null) : ref(props.edit_path.getNodeByPath(editing_note.value) as StructureDefinition)

const edit_context = ref(new StructDefEditContext(struct_def.value, onExitEditStruct))
const edit_state = computed(() => edit_context.value.state)

let attr_def_edit_path: Ref<EditPath | null> = ref(null)
// let attr_def_edit_path: EditPath | null = null
// const attr_def: Ref<AttributeDefinition<any> | null> = ref(null)
function setAttrToEdit(id: string){
    attr_def_edit_path.value = props.edit_path.clone().append(id)
    // attr_def_edit_path = props.edit_path.clone().append(id)
    // attr_def.value = struct_def.value?.attributes.get(id) ?? null
}

function onExitEditStruct(has_change: boolean){
    // close this modal
    emit('update:edit_def_mode', false)
    if (has_change){
        // there is changes to the def
        $Message.info("Update Definition")
    } else {
        $Message.info("Cancel")
    }
}

function startAddAttr() {
    let new_id = StructDefEditEvent.startAddAttr(edit_context.value, (new_attr_def) => {
        
    })
    setAttrToEdit(new_id)
}

function startEditAttr(id: string) {
    StructDefEditEvent.startEditAttr(edit_context.value, id, (new_attr_def) => {
    
    })
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

function attrTypeUpdate(){
    StructDefEditEvent.attrTypeUpdate(edit_context.value)
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
            <div v-show="edit_state === StructDefEditState.EDITING_STRUCT">
                <Button @click="cancelEditStruct">
                    Cancel
                </Button>
    
                <Button type="primary" @click="confirmStructDef">
                    Confirm
                </Button>
            </div>

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