<script setup lang="ts">
import { Icon } from 'view-ui-plus'

const props = defineProps<{
    id: string,
    label: string,
    chosen: boolean,
    image_path: string,
}>()

const choice_class = computed(() => {
    let class_names = "mt-choice-container"
    if (props.chosen){
        class_names += " mt-chosen"
    }
    return class_names
})

const emit = defineEmits<{
    (event: 'select', id: string): void
}>()

function clickToChoose(){
    emit('select', props.id)
}

</script>

<template>
    <div @click="clickToChoose" :class="choice_class">
        <div class="mt-choice-image-box">
            <Image width="200px" height="100px" :src="props.image_path">
                <template #error>
                    <Icon type="ios-image-outline" size="24" color="#ccc" />
                </template>
            </Image>  
        </div>
        <div class="mt-choice-label">{{ props.label }}</div>
    </div>
</template>

<style lang="less" scoped>
.mt-choice-container {
    width: 202px;
    height: 142px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    margin: 2px;
}

.mt-choice-container.mt-chosen {
    border-color: @primary-color;
    color: @primary-color;
}

.mt-choice-label {
    line-height: 30px;
    display: inline-block;
    width: 100%;
    text-align: center;
}

.mt-choice-image-box {
    display: inline-block;
    margin-top: 2px;
    margin-right: 10px;
    width: 100%;
    height: 104px;   
}
</style>