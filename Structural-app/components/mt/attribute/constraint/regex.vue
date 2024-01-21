<script setup lang="ts">
import { EditPath, RegexConstraint, AttributeDefinition, AttributeTypeEnum } from "@structural-note/structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath | null, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const constraint = activeDataGetter(props.attr_def, props.edit_path) as RegexConstraint
</script>

<template>
    <FormItem prop="regex" :label-width="20">
        <mt-attribute-value-editor :type="AttributeTypeEnum.STRING" v-model:value="constraint.pattern" />
    </FormItem>
</template>
