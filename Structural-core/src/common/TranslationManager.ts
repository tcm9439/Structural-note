import type { Locales } from "@/i18n/i18n-types.js"
import L from '@/i18n/i18n-node.js'
import _ from "lodash"
import { locales } from "@/i18n/i18n-util.js"

export class TranslationManager {
    private _default_language_code: string = "en"
   
    constructor(default_language_code?: string){
        if (default_language_code !== undefined){
            if (default_language_code in locales){
                this.default_language_code = default_language_code as Locales
            }
        }
    }

    set default_language_code(language_code: string){
        this._default_language_code = language_code
    }

    /**
     * Translate the given key to the given language code
     * @param key translation key
     * @param param parameter to replace the placeholder
     * @param language_code preferred language code if don't want to use default language code
     * @returns translated string
     * 
     * parameter can be:
     * 1. no parameter
     * 2. named parameter: {name:string}
     * 3. numbered parameter {0}: array of string or number
     */
    public translate(key: string, language_code?: string, param?: Array<string | number> | object | string | number): string {
        const temp: string[] = key.split('.')

        language_code = language_code === undefined ? this._default_language_code : language_code
        let localizationFunction = L[language_code as Locales] as any
        for  (const a of temp){
            localizationFunction = localizationFunction[a]
        }

        if (param !== null){
            if (Array.isArray(param)){
                return localizationFunction(...param)
            }
            return localizationFunction(param)
        }
        return localizationFunction()
    }
}