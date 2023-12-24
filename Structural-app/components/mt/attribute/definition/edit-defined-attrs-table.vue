<!-- 
    The table of all attributes defined in a structural element. 
    For edit purpose.
-->

<script setup lang="ts">
import { StructureDefinition, StructuralDefinitionHelper } from "structural-core"
import { Icon } from "view-ui-plus"
import { TableColumnParser } from "@/composables/active-data/TableColParser"
import { tran } from "~/composables/app/translate"

const props = defineProps<{
    struct_def: StructureDefinition,
}>()

const data = computed(() => {
    return StructuralDefinitionHelper.getAttributesInTableFormat(props.struct_def)
})

const emit = defineEmits<{
    (event: 'create'): void
    (event: 'delete', id: string): void
    (event: 'edit', id: string): void
    (event: 'move-up', id: string): void
    (event: 'move-down', id: string): void
}>()

const ATTR_TABLE_COLUMNS = TableColumnParser(StructuralDefinitionHelper.ATTR_TABLE_COLUMNS)

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
    <Table border :columns="ATTR_TABLE_COLUMNS" :data="data">
        <template #name="{row, index}">
            <strong>{{ row.name }}</strong>
        </template>
        <template #action="{row}">
            <ButtonGroup>
                <Button class="operation-button" @click="moveUpAttr(row.id)" size="small">
                    <Icon type="md-arrow-up" />
                </Button>
                <Button class="operation-button" @click="moveDownAttr(row.id)" size="small">
                    <Icon type="md-arrow-down" />
                </Button>
                <Button type="primary" class="operation-button" size="small"
                    @click="editAttr(row.id)">
                    <Icon type="md-create" />
                </Button>
                <Button type="error" class="operation-button" size="small"
                    @click="deleteAttr(row.id)">
                    <Icon type="md-trash" />
                </Button>
            </ButtonGroup>
        </template>
    </Table>

    <div class="add-section-button-wrapper">
        <Button @click="addAttr" long>
            <Icon type="md-add" />
            {{ tran("common.add") }}
        </Button>
    </div>
</template>

<style scoped>
.operation-button {
    margin-left: 5px;
}

.add-section-button-wrapper {
    margin-top: 20px;
    text-align: center;
}
</style>