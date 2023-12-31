<script setup lang="ts">
/**
 * A component that represent an attribute type and can be selected.
 */
import { IntegerAttribute, DecimalAttribute, ShortStringAttribute, LongStringAttribute, BooleanAttribute, MarkdownAttribute, AttributeType } from "structural-core"
import { tran } from "~/composables/app/translate"

const props = defineProps({
    readonly_mode: {
        type: Boolean,
        required: false,
        default: false,
    },
    attr: {
        type: Object as PropType<AttributeType<any> | null>,
        required: false,
        default: null,
    },
    chosen: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const attr_name = computed(() => {
    return props.attr?.getTypeTranslationKey() || ""
})

const choice_class = computed(() => {
    let class_names = "mt-choice-container"
    if (props.chosen){
        class_names += " mt-chosen"
    }
    return class_names
})

const emit = defineEmits<{
    (event: 'select', attr_type: AttributeType<any>): void
}>()

function typeChosen(){
    if (props.readonly_mode) return // do nothing if readonly
    emit('select', props.attr as AttributeType<any>)
}

function getIcon(){
    switch(props.attr?.type){
        case ShortStringAttribute.TYPE:
            return "mdi:format-text"
        case LongStringAttribute.TYPE:
            return "mdi:text-long"
        case IntegerAttribute.TYPE:
            return "mdi:numeric"
        case DecimalAttribute.TYPE:
            return "mdi:decimal"
        case BooleanAttribute.TYPE:
            return "mdi:toggle-switch"
        case MarkdownAttribute.TYPE:
            return "mdi:language-markdown"
    }
    // unknown type
    return "mdi:help-box"
}

</script>

<template>
    <div v-if="props.attr != null" @click="typeChosen" :class="choice_class">
        <div class="icon-box">
            <!-- Nuxt-Icon -->
            <Icon v-if="props.chosen" :name="getIcon()" color="white"/>
            <Icon v-else :name="getIcon()" color="black"/>
        </div>
        <div class="choice-name">{{ tran(attr_name) }}</div>
    </div>
</template>

<style lang="less" scoped>
.mt-choice-container {
    width: calc(100%-4px);
    height: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    margin: 2px;
}

.mt-choice-container.mt-chosen {
    border-color: @primary-color;
    color: @primary-color;
}

.choice-name {
    /* Let text aligned middle vertically */
    line-height: 30px; 
    display: inline-block;
}

.icon-box {
    display: inline-block;
    margin-right: 10px;
    width: 60px;
    height: 100%;
    line-height: 30px;
    text-align: center;
    background-color: #f0f0f0;
}

.mt-chosen > .icon-box {
    background-color: @primary-color;
}
</style>