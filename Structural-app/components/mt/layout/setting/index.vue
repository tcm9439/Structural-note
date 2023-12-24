<script setup lang="ts">
import { AppState, EventConstant } from "structural-core"
import { tran } from "@/composables/app/translate"
const { $emitter, $Modal } = useNuxtApp()

const router = useRouter()
const setting = AppState.getAppSetting().clone()

const language_list = [
    { label: "English", value: "en" },
    { label: "中文(香港)", value: "zh-HK" },
]

async function confirmSetting() {
    if (!setting.equals(AppState.getAppSetting())) {
        if (setting.language != AppState.getAppSetting().language) {
            // TODO: tell user change iviewui language requires a reload
        }

        // setting is changed
        AppState.setAppSetting(setting)
        $emitter.emit(EventConstant.SETTING_UPDATED)
    }
}

async function cancelSetting() {
    if (!setting.equals(AppState.getAppSetting())) {
        $Modal.confirm({
            title: tran("common.save_confirm_window.title", null, {
                target: tran("structural.setting.title")
            }),
            content: tran("common.save_confirm_window.content"),
            okText: tran("common.save_confirm_window.save"),
            closable: true, // if not clicking one of the button, do nothing
            onOk: () => {
                confirmSetting()
                router.back()
            },
            cancelText: tran("common.save_confirm_window.cancel"),
            onCancel: () => {
                router.back()
            }
        })
    } else {
        router.back()
    }   
}
</script>

<template>
    <Card :title="tran('structural.setting.title')" class="mt-setting-card" dis-hover>
        <Form inline label-position="top">
            <FormItem :label="tran('structural.setting.lang')" prop="lang" >
                <!-- TODO default selected value? -->
                <Select v-model="setting.language" style="width:200px">
                    <Option v-for="lang in language_list" :value="lang.value" :key="lang.value">
                        {{ lang.label }}
                    </Option>
                </Select>
            </FormItem>
        </Form>

        <Space>
            <Button type="primary" @click="confirmSetting">
                {{ tran("common.confirm") }}
            </Button>
            <Button @click="cancelSetting">
                {{ tran("common.cancel")  }}
            </Button>
        </Space>
    </Card>
</template>

<style scoped>
.mt-setting-card {
    margin-bottom: 20px;
}
</style>