<script setup lang="ts">
import { RequireConstrain, EditPath, Note, InjectConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath | null, // edit_path to the AttributeDefinition
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const constrain = activeDataGetter(editing_note, props.edit_path) as RequireConstrain

</script>

<template>
    <FormItem>
        <Switch v-model="constrain.require" />
    </FormItem>
</template>
