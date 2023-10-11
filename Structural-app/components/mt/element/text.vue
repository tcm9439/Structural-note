<script setup lang="ts">
import { TextElement, EditPath, InjectConstant, Note } from "structural-core"
import { activeDataGetter } from '@/composables/active-data/ActiveDataGetter'

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const element = shallowReactive(activeDataGetter(editing_note, props.edit_path) as TextElement)

const here = ref(false)
function mouseoverHandler(){
    here.value = true
}
function mouseleaveHandler(){
    here.value = false
}
const button1 = ref("")
function onButton1Change(){
    console.log("button1 click")
    button1.value = ""
    here.value = false
}
</script>

<template>
    <div 
        @mouseover="mouseoverHandler"
        @mouseleave="mouseleaveHandler"
    >
        <RadioGroup 
            v-model="button1" 
            type="button" 
            v-if="here" 
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
        <!-- TODO extract the mouseover stuff to a base component -->
        <Input 
        type="textarea" :autosize="{ minRows: 2 }"
        v-model="element.content"
        /> 
    </div>
</template>

<style>
    /* Don't allow user to drag & alter size of the input box */
    textarea {
        resize: none;
    }

    floating-element-tool-bar {
        /* TODO */
        padding: auto;
    }
</style>