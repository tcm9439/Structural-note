import { AppException } from "structural-core"
import { tran } from "~/composables/app/translate"

export function exceptionHandler(error: any, fallback_title_key?: string) {
    const { $Modal } = useNuxtApp()

    if (error instanceof AppException){
        $Modal.error({
            title: tran(error.title_key),
            content: tran(error.message_key)
        })
    } else {
        $Modal.error({
            title: fallback_title_key? tran(fallback_title_key) : tran("error.general.title"),
            content: tran("error.general.message")
        })
    }
}