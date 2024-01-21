import type { Locales } from "@/i18n/i18n-types.js"
import L from '@/i18n/i18n-node.js'
import {  } from "lodash-es"
import { locales } from "@/i18n/i18n-util.js"
import { LoggerManager } from "./Logger.js"

export type TranslationParameter = Array<string | number> | object | string | number;

export interface ITranslationManager {
    translate(key: string, language_code?: string | null, param?: TranslationParameter): string
}

export class TranslationManager implements ITranslationManager{
    private _default_language_code: string = "en"
   
    constructor(default_language_code?: string){
        if (default_language_code !== undefined){
            this.default_language_code = default_language_code
        }
    }

    get default_language_code(): string {
        return this._default_language_code
    }

    set default_language_code(language_code: string){
        if (locales.includes(language_code as Locales)){
            this._default_language_code = language_code as Locales
        } else {
            LoggerManager.logger.warn(`Language code ${language_code} is not supported.`)
        }
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
    public translate(key: string, language_code?: string | null, param?: TranslationParameter): string {
        const temp: string[] = key.toLowerCase().split('.')

        language_code = language_code == null ? this._default_language_code : language_code
        let localizationFunction = L[language_code as Locales] as any
        for  (const a of temp){
            localizationFunction = localizationFunction[a]
        }

        let translated: string
        if (param == null){
            translated = localizationFunction()
        } else {
            if (Array.isArray(param)){
                translated = localizationFunction(...param)
            } else {
                translated = localizationFunction(param)
            }
        }

        // return a fallback of the translation key (easier to debug)
        if (translated == null || translated == ""){
            translated = key
        }
        return translated
    }
}