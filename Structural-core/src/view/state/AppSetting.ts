import { LanguageCode } from "@/common/CommonTypes.js"
import { Cloneable } from "@/common/Cloneable.js"

export class AppSetting implements Cloneable<AppSetting>{
    private _language: LanguageCode = "en"
    
    get language(): LanguageCode {
        return this._language
    }
    
    set language(language: LanguageCode) {
        this._language = language
    }

    // TODO: implement clone
    clone(): AppSetting {
        throw new Error("Method not implemented.")
    }

    cloneFrom(other: AppSetting): void {
        throw new Error("Method not implemented.")
    }

    cloneDeepWithCustomizer(): AppSetting | undefined {
        throw new Error("Method not implemented.")
    }
}