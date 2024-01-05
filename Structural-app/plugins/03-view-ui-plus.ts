import 'view-ui-plus/dist/styles/viewuiplus.css'
import "./assets/less/mt-theme.less"
import ViewUIPlus from 'view-ui-plus'
import EN_US from 'view-ui-plus/dist/locale/en-US'
import ZH_TW from 'view-ui-plus/dist/locale/zh-TW'

import { Modal, Message } from "view-ui-plus"
import { AppState } from "structural-core"

declare module "#app" {
    interface NuxtApp {
        $Modal: typeof Modal;
        $Message: typeof Message;
    }
}

const useLanguage = (nuxtApp: any, lang: string) => {
    switch (lang) {
        case 'zh-HK':
            nuxtApp.vueApp.use(ViewUIPlus, { transfer: true, locale: ZH_TW })
            break;
        default:
            nuxtApp.vueApp.use(ViewUIPlus, { transfer: true, locale: EN_US })
            break;   
    }
}


export default defineNuxtPlugin((nuxtApp) => {
    // https://nuxt.com/docs/api/advanced/hooks
    // nuxtApp.hook('app:mounted', (..._args) => {        
    nuxtApp.hook('app:created', (..._args) => {        
        useLanguage(nuxtApp, AppState.getAppSetting().language)
        nuxtApp.provide('Modal', Modal)
        nuxtApp.provide('Message', Message)
    })
})
