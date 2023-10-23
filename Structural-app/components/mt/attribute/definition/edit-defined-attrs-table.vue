<!-- 
    The table of all attributes defined in a structural element. 
    For edit purpose.
-->

<script setup lang="ts">
import { StructureDefinition, EditPath, Note, StructuralDefinitionHelper, InjectConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { Icon } from "view-ui-plus"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureDefinition
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const struct_def = activeDataGetter(editing_note, props.edit_path) as StructureDefinition

const data = computed(() => {
    return StructuralDefinitionHelper.getAttributesInTableFormat(struct_def)
})

const emit = defineEmits<{
    (event: 'create'): void
    (event: 'delete', id: string): void
    (event: 'edit', id: string): void
    (event: 'move-up', id: string): void
    (event: 'move-down', id: string): void
}>()

/**
 * Create and add a new attribute to the StructureDefinition
 */
function addAttr() {
    emit('create')
}

function editAttr(id: string) {
    emit('edit', id)
}

function deleteAttr(id: string) {
    emit('delete', id)
}

function moveUpAttr(id: string) {
    emit('move-up', id)
}

function moveDownAttr(id: string) {
    emit('move-down', id)
}
</script>

<template>
    <!-- Current defined attributes inside this section. -->
    <Table border :columns="StructuralDefinitionHelper.ATTR_TABLE_COLUMNS" :data="data">
        <template #name="{ row, index }">
            <strong>{{row.name}}</strong>
        </template>
        <template #action="{ row }">
            <ButtonGroup>
                <Button class="operation-button" @click="moveUpAttr(row.id)">
                    <Icon type="md-arrow-up" />
                </Button>
                <Button class="operation-button" @click="moveDownAttr(row.id)">
                    <Icon type="md-arrow-down" />
                </Button>
                <Button type="primary" class="operation-button"
                    @click="editAttr(row.id)">
                    <Icon type="md-create" />
                </Button>
                <Button type="error" class="operation-button"
                    @click="deleteAttr(row.id)">
                    <Icon type="md-trash" />
                </Button>
            </ButtonGroup>
        </template>
    </Table>

    <Button @click="addAttr">
        <Icon type="md-add" />
        Add
    </Button>
</template>

<style scoped>
.operation-button {
    margin-left: 5px;
}
</style>