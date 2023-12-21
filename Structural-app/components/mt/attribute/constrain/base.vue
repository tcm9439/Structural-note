<script setup lang="ts">
import { AttributeDefinition, ConstrainType } from "structural-core"
import { type AttrConstrainEditComponent } from "@/composables/active-data/Constrain"

const props = defineProps<{
    params: AttrConstrainEditComponent
    attr_def: AttributeDefinition<any>
    render: number
}>()

const emit = defineEmits<{
    (event: "update", is_set: boolean, params: AttrConstrainEditComponent): void
}>()

const constrain_enabled = ref(false)
const constrains_that_exist_means_true = [
    ConstrainType.REQUIRE
]
const constrain_exist_means_true = computed(() => {
    return constrains_that_exist_means_true.includes(props.params.constrain_type)
})
const load_constrain_editor = computed(() => {
    return constrain_exist_means_true.value || constrain_enabled.value
})
const label = ref("")

watch(
    () => props.render,
    () => {
        constrain_enabled.value = props.params.path !== null
        label.value = props.params.label
    },
    { immediate: true }
)

function onToggleConstrain() {
    if (!constrain_exist_means_true.value) {
        emit("update", constrain_enabled.value, props.params)
    }
}
</script>

<template>
    <FormItem :prop="label + '_checkbox'">
        <Checkbox v-model="constrain_enabled" @on-change="onToggleConstrain">
            {{label}}
        </Checkbox>
    </FormItem>
    <template v-if="load_constrain_editor">
        <component
            :is="props.params.component_type"
            :id="props.params.id"
            :edit_path="props.params.path"
            :enable="constrain_enabled"
            :attr_def="attr_def" 
        />
    </template>
</template>
