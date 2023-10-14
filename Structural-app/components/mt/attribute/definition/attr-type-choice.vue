<script setup lang="ts">
/**
 * A component that represent an attribute type and can be selected.
 */
import { AttrTypeNameAndInstance } from "structural-core"

const props = defineProps<{
    attr_type: AttrTypeNameAndInstance | null,
}>()

const emit = defineEmits<{
    (event: 'select', attr_type: AttrTypeNameAndInstance): void
}>()

function typeChosen(){
    emit('select', props.attr_type as AttrTypeNameAndInstance)
}

</script>

<template>
    <Radio style="width: 100%;" v-if="attr_type !== null" :label="attr_type.name" @change="typeChosen">
        <!-- TODO different icon -->
        <Icon type="md-reorder" />
        {{ attr_type.name }}
    </Radio>
</template>