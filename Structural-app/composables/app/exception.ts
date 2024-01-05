import { AppException, AppState, EventConstant } from "structural-core"
import { tran } from "~/composables/app/translate"

export function exceptionHandler(error: any, fallback_title_key?: string) {
    const { $Modal, $emitter } = useNuxtApp()
    let onOkCallback = () => {
        AppState.logger.debug("Global error modal closed.")
        $emitter.emit(EventConstant.ERROR_MODAL_CLOSED)
    }

    if (error instanceof AppException){
        $Modal.error({
            title: tran(error.title_key),
            content: tran(error.message_key),
            onOk: () => onOkCallback(),
        })
    } else {
        $Modal.error({
            title: fallback_title_key? tran(fallback_title_key) : tran("error.general.title"),
            content: tran("error.general.message"),
            onOk: () => onOkCallback(),
        })
    }
}