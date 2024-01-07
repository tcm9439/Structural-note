<script setup lang="ts">
import { Icon } from 'view-ui-plus'
import { tran } from '~/composables/app/translate'

const props = defineProps<{
    tags: [number, string][]
}>()

const emit = defineEmits<{
    (event: "delete", index: number): void
    (event: "create", value: string): void
}>()

function onDelete(index: number){
    emit("delete", index)
}

const new_tag = ref("")
function onCreate(){
    emit("create", new_tag.value)
    new_tag.value = ""
}

const tag_input = ref<HTMLDivElement>()
function focusToInput(){
    if (tag_input.value) {
        tag_input.value.focus()
    }
    toggleValueContainerClass(true)
}

const tag_editor = ref<HTMLDivElement>()
onClickOutside(tag_editor, (event) => {
    toggleValueContainerClass(false)
})

const value_container_class = ref("mt-tag-values-container")
function toggleValueContainerClass(editing: boolean){
    if (editing){
        value_container_class.value = "mt-tag-values-container mt-on-edit"
    } else {
        value_container_class.value = "mt-tag-values-container"
    }
}

const tooltip_content = tran("common.tag_editor_tooltip")
</script>

<template>
    <div class="mt-tag-value-editor" ref="tag_editor">
        <Tooltip placement="top" :content="tooltip_content" style="margin-right: 2px;">
            <Icon type="md-information-circle" />
        </Tooltip>
        <div :class="value_container_class" @click="focusToInput">
            <div v-for="value in props.tags" class="mt-tag-value">
                {{ value[1] }}
                <Icon type="md-close" @click="onDelete(value[0])"/>
            </div>
            <span class="mt-input-caret"></span>
            <div class="mt-tag-input-display">
                {{ new_tag }}
            </div>
        </div>
        <input 
            @keyup.enter.native="onCreate" v-model="new_tag" 
            ref="tag_input"
            class="mt-tag-input-box"
        />
    </div>
</template>

<style lang="less" scoped>
.mt-tag-value-editor {
    display: inline-block;
    width: 100%;
}

.mt-tag-input-display {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin: 2px 4px 2px 0;
    padding: 0 8px;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    overflow: hidden;
}

.mt-tag-values-container {
    display: inline-block;
    width: calc(95% - 15px);
    outline: none;
    user-select: none;
    cursor: pointer;
    position: relative;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdee2;
    padding-left: 4px;
    margin-bottom: 2px;
}

.mt-tag-values-container.mt-on-edit {
    border: 1px solid @primary-color;
}

.mt-tag-value {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin: 2px 4px 2px 0;
    padding: 0 8px;
    border: 1px solid #e8eaec;
    border-radius: 3px;
    background: #f7f7f7;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    overflow: hidden;
}

.mt-tag-input-box {
    width: 0px;
    border: white;
    color: white;
}
</style>