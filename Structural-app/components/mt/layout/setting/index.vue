<script setup lang="ts">
import { AppState } from "structural-core"
import { tran } from "@/composables/app/translate"
const { $emitter } = useNuxtApp()

const router = useRouter()
// const setting = AppState.getAppSetting().clone()
const setting = AppState.getAppSetting()

// TODO: change iviewui language
const language_list = [
    { label: "English", value: "en" },
    { label: "中文(香港)", value: "zh-HK" },
]

const setting_title = tran("structural.setting.title")
const language_label = tran("structural.setting.lang")

async function confirmSetting() {
    AppState.setAppSetting(setting)
    $emitter.emit("RELOAD_PAGE")
}

async function cancelSetting() {
    // TODO if old_setting != new_setting, ask for confirmation
    router.back()
}
</script>

<template>
    <Card :title="setting_title" class="mt-setting-card" dis-hover>
        <Form inline label-position="top">
            <FormItem :label="language_label" prop="lang" >
                <!-- TODO default selected value -->
                <Select v-model="setting.language" style="width:200px">
                    <Option v-for="lang in language_list" :value="lang.value" :key="lang.value">
                        {{ lang.label }}
                    </Option>
                </Select>
            </FormItem>
        </Form>

        <Space>
            <Button type="primary" @click="confirmSetting">
                Confirm
            </Button>
            <Button @click="cancelSetting">
                Cancel
            </Button>
        </Space>
    </Card>
</template>

<style scoped>
.mt-setting-card {
    margin-bottom: 20px;
}
</style>