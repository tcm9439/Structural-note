<script setup lang="ts">
/**
 * A component that represent an attribute type and can be selected.
 */
import { AttrTypeNameAndInstance, IntegerAttribute, DecimalAttribute, StringAttribute, BooleanAttribute, MarkdownAttribute } from "structural-core"

const props = defineProps({
    readonly_mode: { type: Boolean, default: false },
    attr_type: { type: AttrTypeNameAndInstance, required: false },
    attr_name: { type: String, required: false }
})

const attr_name = computed(() => props.readonly_mode? props.attr_name : props.attr_type?.name)

const emit = defineEmits<{
    (event: 'select', attr_type: AttrTypeNameAndInstance): void
}>()

function typeChosen(){
    if (props.readonly_mode) return // do nothing if readonly
    emit('select', props.attr_type as AttrTypeNameAndInstance)
}

function getIcon(){
    switch(attr_name.value){
        case StringAttribute.TYPE:
            return "mdi:format-text"
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
    <div v-if="attr_type !== null" @click="typeChosen" class="choice-container">
        <div class="icon-box">
            <!-- Nuxt-Icon -->
            <Icon :name="getIcon()" color="black"/>
        </div>
        <div class="choice-name">{{ attr_name }}</div>
    </div>
</template>

<style scoped>
.choice-container {
    width: 100%;
    height: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
}

.choice-name {
    /* Let text aligned middle vertically */
    line-height: 30px; 
    display: inline-block;
}

.icon-box{
    display: inline-block;
    margin-right: 10px;
    width: 60px;
    height: 100%;
    line-height: 30px;
    text-align: center;
    background-color: #f0f0f0;
}
</style>