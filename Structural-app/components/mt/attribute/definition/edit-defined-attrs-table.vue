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
            <strong>{{row.name}}</strong>
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