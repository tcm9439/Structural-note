<script setup lang="ts">
import { AppState, EventConstant, AppPage, AppPageUtil } from "structural-core"
import { tran } from "@/composables/app/translate"
const { $emitter, $Modal, $viewState } = useNuxtApp()

const setting = AppState.getAppSetting().clone()
$emitter.emit(EventConstant.LAYOUT_UPDATE, AppPage.SETTING)

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

async function backToLastPage(){
    $emitter.emit(EventConstant.LAYOUT_UPDATE, $viewState.last_page)
    await navigateTo(AppPageUtil.getPageRoute($viewState.last_page))
}

async function cancelSetting() {
    if (!setting.equals(AppState.getAppSetting())) {
        AppState.logger.debug(`Setting is changed. Ask for saved.`)
        $Modal.confirm({
            title: tran("common.save_confirm_window.title", null, {
                target: tran("structural.setting.title")
            }),
            content: tran("common.save_confirm_window.content"),
            okText: tran("common.save_confirm_window.save"),
            closable: true, // if not clicking one of the button, do nothing
            onOk: async () => {
                confirmSetting()
                await backToLastPage()
            },
            cancelText: tran("common.save_confirm_window.cancel"),
            onCancel: async () => {
                await backToLastPage()
            }
        })
    } else {
        AppState.logger.debug(`Setting is unchanged. Back to last page.`)
        await backToLastPage()
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