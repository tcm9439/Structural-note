<script setup lang="ts">
const props = defineProps<{
    id: string,
}>()

const emit = defineEmits<{
    (event: 'delete', id: string): void
    (event: 'moveUp', id: string): void
    (event: 'moveDown', id: string): void
}>()

const hover_here = ref(false)
function mouseoverHandler(){
    hover_here.value = true
}
function mouseleaveHandler(){
    hover_here.value = false
}
const button1 = ref("")
function onButton1Change(){
    switch (button1.value){
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
    button1.value = ""
    hover_here.value = false
}
</script>

<template>
    <div 
        class="container"
        @mouseover="mouseoverHandler"
        @mouseleave="mouseleaveHandler"
    >
        <RadioGroup 
            v-model="button1" 
            type="button" 
            v-if="hover_here" 
            @on-change="onButton1Change"
            class="floating-element-tool-bar">
                <Radio label="delete">
                    <Icon type="md-trash" />
                </Radio>
                <Radio label="moveUp">
                    <Icon type="md-arrow-up" />
                </Radio>
                <Radio label="moveDown">
                    <Icon type="md-arrow-down" />
                </Radio>
        </RadioGroup>
        <slot name="content"></slot>
    </div>
        
</template>

<style>
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