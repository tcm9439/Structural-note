import 'view-ui-plus/dist/styles/viewuiplus.css';
import ViewUIPlus from 'view-ui-plus'
import EN_US from 'view-ui-plus/dist/locale/en-US'

import { Modal, Message } from "view-ui-plus";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ViewUIPlus, { transfer: true, locale: EN_US })
    nuxtApp.provide('Modal', Modal)
    nuxtApp.provide('Message', Message)
})
