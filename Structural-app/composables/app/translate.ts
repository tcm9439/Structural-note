import { AppState } from "structural-core"

export function tran(key: string, language_code?: string | undefined, param?: string | number | object | (string | number)[] | undefined): string {
    return AppState.translationManager.translate(key, language_code, param)
}