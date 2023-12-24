import { LanguageCode } from "@/common/CommonTypes.js"
import { AppState } from "@/view/state/AppState"
import _ from "lodash"

import { z } from "zod"

export const AppSettingJson = z.object({
    language: z.string()
}).required()

export class AppSetting {
    private _language: LanguageCode = "en"
    
    get language(): LanguageCode {
        return this._language
    }
    
    set language(language: LanguageCode) {
        if (AppState.translationManager){
            AppState.translationManager.default_language_code = language
            this._language = AppState.translationManager.default_language_code
        } else {
            this._language = language
        }
    }

    public clone(): AppSetting {
        return _.cloneDeep(this)
    }

    public equals(other: AppSetting): boolean {
        return this.language === other.language
    }

    public static fromJson(json: any): AppSetting {
        const appSetting = new AppSetting()
        let result = AppSettingJson.safeParse(json)
        if (!result.success) {
            // use default setting
            return appSetting
        }
        const valid_json = result.data
        appSetting.language = valid_json.language
        return appSetting
    }
}