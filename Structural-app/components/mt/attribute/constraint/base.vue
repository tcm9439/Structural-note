<script setup lang="ts">
import { AttributeDefinition, ConstraintType } from "structural-core"
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
const constraints_that_exist_means_true = [
    ConstraintType.REQUIRE
]
const constraint_exist_means_true = computed(() => {
    return constraints_that_exist_means_true.includes(props.params.constraint_type)
})
const load_constraint_editor = computed(() => {
    return constraint_exist_means_true.value || constraint_enabled.value
})
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
    if (!constraint_exist_means_true.value) {
        emit("update", constraint_enabled.value, props.params)
    }
}

function onExistMeansTrueConstraintUpdate(new_val: boolean) {
    // init the constraint enable checkbox by the constraint init value
    constraint_enabled.value = new_val
    onToggleConstraint()
}
</script>

<template>
    <FormItem :prop="label + '_checkbox'">
        <Checkbox v-model="constraint_enabled" @on-change="onToggleConstraint">
            {{label}}
        </Checkbox>
    </FormItem>
    <template v-if="load_constraint_editor">
        <component
            :is="props.params.component_type"
            :id="props.params.id"
            :edit_path="props.params.path"
            :enable="constraint_enabled"
            :attr_def="attr_def" 
            @existMeansTrueConstraintUpdate="onExistMeansTrueConstraintUpdate"
        />
    </template>
</template>
