<script setup lang="ts">
import { EditPath, Note, StructureDefinition, EventConstant, StructDefEditContext, StructDefEditState, StructDefEditEvent, InjectConstant, AttributeDefinition, StructuralSection } from "@structural-note/structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { Icon } from "view-ui-plus"
import { tran } from "~/composables/app/translate"
const { $Message } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureDefinition
    edit_def_mode: boolean,
    struct_section: StructuralSection,
}>()

const emit = defineEmits<{
    (event: 'update:edit_def_mode', visible: boolean): void
}>()
const { $emitter } = useNuxtApp()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const struct_def = activeDataGetter(editing_note, props.edit_path) as StructureDefinition
const ori_struct_def = struct_def.clone()

const edit_context = ref(new StructDefEditContext(struct_def, onExitEditStruct)) as Ref<StructDefEditContext>
const editing_struct_def = edit_context.value.editing_struct_def.editing
const edit_state = computed(() => edit_context.value.state)
const struct_has_change = computed(() => edit_context.value.hasChange())

// # error modal
const show_error_modal = ref(false)
const error_title = ref("")
const error_content = ref("")

let attr_def: Ref<AttributeDefinition<any> | null> = ref(null)
function setAttrToEdit(){
    attr_def.value = edit_context.value.editing_attr_def.editing
}

function showInvalidDefinitionMessage(def_type_key: string, error_msg: string){
    show_error_modal.value = true
    error_title.value = tran("structural.struct_def.invalid_definition", null, { target: tran(def_type_key) })
    error_content.value = error_msg
}

function onErrorModalConfirm(){
    show_error_modal.value = false
}

function getOriAttrDefOfEditingAttr(){
    return ori_struct_def.attributes.get(edit_context.value.editing_attr_def.editing.id) ?? null
}

function onExitEditStruct(has_change: boolean){
    if (has_change){
        // there is changes to the def
        $emitter.emit(EventConstant.ATTR_DEF_UPDATE, ori_struct_def, edit_context.value.edit_queue)
        $Message.info(tran("structural.struct_def.update_attr_def_confirm"))
    } else {
        $Message.info(tran("common.cancel"))
    }
    // close this modal
    emit('update:edit_def_mode', false)
}

function startAddAttr() {
    StructDefEditEvent.startAddAttr(edit_context.value)
    setAttrToEdit()
}

function startEditAttr(id: string) {
    StructDefEditEvent.startEditAttr(edit_context.value, id)
    setAttrToEdit()
}

function deleteAttr(id: string) {
    StructDefEditEvent.deleteAttr(edit_context.value, id)
}

function moveUpAttr(id: string) {
    StructDefEditEvent.moveUpAttr(edit_context.value, id)
}

function moveDownAttr(id: string) {
    StructDefEditEvent.moveDownAttr(edit_context.value, id)
}

function confirmEditAttr() {
    let result = StructDefEditEvent.confirmEditAttr(edit_context.value)
    if (result?.valid === false){
        showInvalidDefinitionMessage("structural.attribute.attribute", result.invalid_message)
    }
}

function cancelEditAttr() {
    StructDefEditEvent.cancelEditAttr(edit_context.value)
}

function updateDisplayKey(){
    StructDefEditEvent.updateDisplayKey(edit_context.value)
}

function confirmStructDef(){
    let result = StructDefEditEvent.confirmEditStruct(edit_context.value)
    if (result?.valid === false){
        showInvalidDefinitionMessage("structural.section.section", result.invalid_message)
    }
}

function cancelEditStruct() {
    StructDefEditEvent.cancelEditStruct(edit_context.value)
}

const render_attr_def = ref(0)
function attrTypeUpdate(new_attr_def: AttributeDefinition<any> | null){
    if (new_attr_def !== null){
        // change the ori attr type
        StructDefEditEvent.attrTypeUpdate(edit_context.value, new_attr_def)
        attr_def.value = edit_context.value.editing_attr_def.editing
    }
    // else a init attr type is set

    // re-render the attr def
    render_attr_def.value += 1
}

</script>

<template>
    <Modal
        :modelValue="props.edit_def_mode"
        :title="tran('structural.struct_def.section_def_title')"
        :closable="false"
        :mask-closable="false"
        scrollable
        width="85"
    >
        <div class="mt-section-def-edit-modal">
        <!-- Attributes list -->
        <div v-if="edit_state === StructDefEditState.EDITING_STRUCT">
            <Tabs>
                <TabPane :label="tran('structural.struct_def.attributes_tab_title')" name="attributes">
                    <mt-attribute-definition-edit-defined-attrs-table
                        @create="startAddAttr" 
                        @delete="deleteAttr"
                        @edit="startEditAttr"
                        @move-up="moveUpAttr"
                        @move-down="moveDownAttr"
                        :struct_def="editing_struct_def" />
                </TabPane>
                <TabPane :label="tran('structural.struct_def.display_name_tab_title')" name="display_name">
                    <mt-attribute-definition-edit-display-key-table 
                        v-model:struct_def="editing_struct_def"
                        @update="updateDisplayKey"
                    />              
                </TabPane>
            </Tabs>
        </div>

        <!-- Edit one of the attribute -->
        <div v-if="edit_state === StructDefEditState.EDITING_ATTR && attr_def != null">
            <mt-attribute-definition-edit-attr-def 
                @attrTypeUpdate="attrTypeUpdate"
                :attr_def="attr_def"
                :ori_attr_def="getOriAttrDefOfEditingAttr()"
                :render="render_attr_def"
            />
        </div>
        </div>

        <!-- Confirm / Cancel Button -->
        <template #footer>
            <!-- The button set for the whole struct def -->
            <div v-show="edit_state === StructDefEditState.EDITING_STRUCT">
                <!-- Cancel button is always show & is the only way to close this Modal -->
                <Button @click="cancelEditStruct">
                    {{ tran("common.cancel") }}
                </Button>

                <!-- If no change is done, don't allow user to click the confirm button. -->
                <Button type="primary" @click="confirmStructDef" :disabled="!struct_has_change">
                    {{ tran("common.confirm") }}
                </Button>
            </div>

            <!-- The button set for the selected editing attr def -->
            <div v-show="edit_state === StructDefEditState.EDITING_ATTR">
                <Button @click="cancelEditAttr">
                    {{ tran("common.cancel") }}
                </Button>
    
                <Button type="primary" @click="confirmEditAttr">
                    {{ tran("common.confirm") }}
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
                    {{ tran("common.confirm") }}
                </Button>
            </template>
        </Modal>
    </Modal>
</template>

<style scoped>
.mt-section-def-edit-modal {
    min-height: 50vh;
}
</style>
