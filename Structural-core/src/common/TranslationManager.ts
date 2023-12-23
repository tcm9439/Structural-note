import type { Locales } from "@/i18n/i18n-types"
import L from '@/i18n/i18n-node'
import _ from "lodash"

export class TranslationManager {
    private _default_language_code: Locales;
   
    constructor(default_language_code?: Locales){
        this._default_language_code = default_language_code === undefined ? 'en' : default_language_code
    }

    set default_language_code(language_code: Locales){
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
    public translate(key: string, language_code?: Locales, param?: Array<string | number> | object | string | number): string {
        const temp: string[] = key.split('.')

        language_code = language_code === undefined ? this._default_language_code : language_code
        let localizationFunction = L[language_code] as any
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