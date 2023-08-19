<script setup lang="ts">
import { StructuralElement } from "structural-core"

const props = defineProps<{
    struct_element: StructuralElement,
}>()

</script>

<template>
    <template v-for="element_values in props.struct_element.ordered_values">
        <template v-if="element_values.definition_type == 'STRING'">
            <vue-attribute-value-string :str_value="element_values"></vue-attribute-value-string>
        </template> 
    </template>
</template>