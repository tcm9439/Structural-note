<script setup lang="ts">
import { StructureDefinition, StructuralDefinitionHelper, type IViewUITableData } from "structural-core"
import { Divider, Icon } from "view-ui-plus"
import { TableColumnParser } from "@/composables/active-data/TableColParser"
import { tran } from "~/composables/app/translate"

const props = defineProps<{
    struct_def: StructureDefinition,
}>()

const data = computed(() => {
    return StructuralDefinitionHelper.getDisplayKeyInTableFormat(props.struct_def)
})

const emit = defineEmits<{
    (event: "update:struct_def", struct_def: StructureDefinition): void
    (event: "update"): void
}>()

const DISPLAY_KEY_TABLE_COLUMNS = TableColumnParser(StructuralDefinitionHelper.DISPLAY_KEY_TABLE_COLUMNS)

function addAttr(selection: IViewUITableData[], row: IViewUITableData){
    let attr = props.struct_def.attributes.get(row.id)
    if (attr !== undefined){
        props.struct_def.display_key.addKey(attr)
    }
    emit('update')
}

function removeAttr(selection: IViewUITableData[], row: IViewUITableData){
    props.struct_def.display_key.removeKey(row.id)
    emit('update')
}

function addAll(selection: IViewUITableData[]){
    selection.forEach((attr_data) => {
        if (props.struct_def.display_key.hasKey(attr_data.id)){
            return
        }
        let attr = props.struct_def.attributes.get(attr_data.id)
        if (attr !== undefined){
            props.struct_def.display_key.addKey(attr)
        }
    })
    emit('update')
}

function removeAll(selection: IViewUITableData[]){
    props.struct_def.display_key.removeAll()
    emit('update')
}

function moveUp(id: string){
    props.struct_def.display_key.keys.moveUp(id)
    emit('update')
}

function moveDown(id: string){
    props.struct_def.display_key.keys.moveDown(id)
    emit('update')
}

const separator = ref(props.struct_def.display_key.separator)
function setSeparator(value: string){
    props.struct_def.display_key.separator = value
    emit('update')
}
</script>

<template>
    {{ tran("structural.struct_def.display_name_separator_label") }}{{ tran("symbol.colon") }}
    <RadioGroup :modelValue="separator" @on-change="setSeparator">
        <Radio label="~" border>~</Radio>
        <Radio label="-" border>-</Radio>
        <Radio label="." border>.</Radio>
    </RadioGroup>

    <Divider />

    <!-- Current defined attributes inside this section. -->
    <Table border 
        :columns="DISPLAY_KEY_TABLE_COLUMNS" :data="data"
        @on-select="addAttr"
        @on-select-cancel="removeAttr"
        @on-select-all="addAll"
        @on-select-all-cancel="removeAll"
    >
        <template #name="{row, index}">
            <strong>{{row.name}}</strong>
        </template>
        <template #action="{row}">
            <ButtonGroup>
                <Button :disabled="!row.selected" class="operation-button" @click="moveUp(row.id)">
                    <Icon type="md-arrow-up" />
                </Button>
                <Button :disabled="!row.selected" class="operation-button" @click="moveDown(row.id)">
                    <Icon type="md-arrow-down" />
                </Button>
            </ButtonGroup>
        </template>
    </Table>
</template>