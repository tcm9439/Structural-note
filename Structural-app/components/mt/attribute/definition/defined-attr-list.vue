<script setup lang="ts">
import { StructureDefinition, EditPath, Note, StructuralDefinitionHelper, InjectConstant } from "structural-core"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureDefinition
}>()

const editing_note: Ref<Note> | undefined = ref(inject(InjectConstant.EDITING_NOTE))
const struct_def = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as StructureDefinition)

const data = computed(() => {
    return StructuralDefinitionHelper.getAttributesInTableFormat(struct_def?.value)
})

const emit = defineEmits<{
    (event: 'create'): void
    (event: 'delete', id: string): void
    (event: 'edit', id: string): void
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
</script>

<template>
    <!-- Current defined attributes inside this section. -->
    <Table border :columns="StructuralDefinitionHelper.ATTR_TABLE_COLUMNS" :data="data">
        <template #name="{ row, index }">
            <strong>{{ row.name }}</strong>
        </template>
        <template #action="{ row }">
            <Button type="primary" size="small" style="margin-right: 5px" 
                @click="editAttr(row.id)">
                Edit
            </Button>
            
            <Button type="error" size="small" 
                @click="deleteAttr(row.id)">
                Delete
            </Button>
        </template>
    </Table>

    <Button @click="addAttr">
        <Icon type="md-add" />
        Add
    </Button>
</template>