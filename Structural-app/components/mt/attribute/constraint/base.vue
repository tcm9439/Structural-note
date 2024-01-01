<script setup lang="ts">
import { AttributeDefinition } from "structural-core"
import { type AttrConstraintEditComponent } from "@/composables/active-data/Constraint"

const props = defineProps<{
    params: AttrConstraintEditComponent
    attr_def: AttributeDefinition<any>
    render: number
}>()

const emit = defineEmits<{
    (event: "update", is_set: boolean, params: AttrConstraintEditComponent): void
}>()

const constraint_enabled = ref(false)
const label = ref("")

watch(
    () => props.render,
    () => {
        constraint_enabled.value = props.params.path !== null
        label.value = props.params.label
    },
    { immediate: true }
)

function onToggleConstraint() {
    emit("update", constraint_enabled.value, props.params)
}

function onInitNoParamConstraint(enable: boolean) {
    // init the constraint enable checkbox by the constraint init value
    constraint_enabled.value = enable
}
</script>

<template>
    <FormItem :prop="label + '_checkbox'">
        <Checkbox v-model="constraint_enabled" @on-change="onToggleConstraint">
            {{ label }}
        </Checkbox>
    </FormItem>
    <template v-if="constraint_enabled">
        <component
            :is="props.params.component_type"
            :id="props.params.id"
            :edit_path="props.params.path"
            :enable="constraint_enabled"
            :attr_def="attr_def" 
            @initNoParamConstraint="onInitNoParamConstraint"
        />
    </template>
</template>
