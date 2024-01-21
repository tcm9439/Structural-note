<script setup lang="ts">
import { ElementType } from "@structural-note/structural-core"
import { Icon } from "view-ui-plus"

const props = defineProps<{
    id: string,
}>()

const emit = defineEmits<{
    (event: 'add', element_type: ElementType, id: string): void
    (event: 'delete', id: string): void
    (event: 'moveUp', id: string): void
    (event: 'moveDown', id: string): void
}>()

const hover_here = ref(false)
const click_add = ref(false)
let click_add_time: Date | null = null
const show_operation_button = computed(() => hover_here.value || click_add.value)
function mouseoverHandler(){
    hover_here.value = true
}
function mouseleaveHandler(){
    hover_here.value = false
}
const operation_button = ref("")
function onOperationButtonChange(){
    switch (operation_button.value){
        case "add":
            onAddButtonClick()
            break
        case "delete":
            emit('delete', props.id)
            break
        case "moveUp":
            emit('moveUp', props.id)
            break
        case "moveDown":
            emit('moveDown', props.id)
            break
    }
    operation_button.value = ""
    hover_here.value = false
}

// # Add Element
function onAddButtonClick(){
    click_add_time = new Date()
    click_add.value = true
}
function addElement(element_type: ElementType){
    click_add.value = false
    click_add_time = null
    emit('add', element_type, props.id)
    operation_button.value = ""
}
function cancelAdd(){
    hover_here.value = false
    // if click_add_time is not null and the time difference is more than 0.01 second, cancel add
    if (click_add.value && click_add_time != null && (new Date().getTime() - click_add_time.getTime()) > 30){
        click_add.value = false
        click_add_time = null
    }
    operation_button.value = ""
}
</script>

<template>
    <div 
        class="container"
        @mouseover="mouseoverHandler"
        @mouseleave="mouseleaveHandler"
    >
        <RadioGroup 
            v-model="operation_button" 
            type="button"
            v-if="show_operation_button"
            @on-change="onOperationButtonChange"
            class="floating-element-tool-bar">
                <!-- Other operation -->
                <Radio label="moveUp">
                    <Icon type="md-arrow-up" />
                </Radio>
                <Radio label="moveDown">
                    <Icon type="md-arrow-down" />
                </Radio>
                <Radio label="delete">
                    <Icon type="md-trash" />
                </Radio>
                 <!-- Available Element to add -->
                 <Radio label="add">
                    <Dropdown 
                        @on-click="addElement" 
                        @on-clickoutside="cancelAdd"
                        trigger="custom" :visible="click_add">
                        <Icon type="md-add" @click="onAddButtonClick"/>
                        <template #list>
                            <DropdownMenu>
                                <slot name="available_element"></slot>
                            </DropdownMenu>
                        </template>
                    </Dropdown>
                </Radio>
            </RadioGroup>
        <slot name="content"></slot>
    </div>
        
</template>

<style scoped>
.container {
    position: relative;
    padding: 8px;
}

.floating-element-tool-bar {
    position: absolute;
    right: 20px;
    top: -6px;
    z-index: 10;
}
</style>