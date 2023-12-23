import { LanguageCode } from "@/common/CommonTypes"

export class UserSetting {
    private _language: LanguageCode = "en"

    get language(): LanguageCode {
        return this._language
    }

    set language(language: LanguageCode) {
        this._language = language
    }
}