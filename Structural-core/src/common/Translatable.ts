import { ITranslationManager, TranslationParameter } from "./TranslationManager.js"
import { set, cloneDeep} from "lodash-es"

export class TranslatableTextElement {
    private _translation_key: string
    private _tran_prams?: TranslationParameter

    constructor(translation_key: string, tran_prams?: TranslationParameter){
        this._translation_key = translation_key
        this._tran_prams = tran_prams
    }

    toDisplayText(tran: ITranslationManager, lang?: string){
        // map the param to displayText if it is a TranslatableText
        if (typeof this._tran_prams === "object"){
            let new_tran_prams = cloneDeep(this._tran_prams)
            // for each property
            for (const [key, value] of Object.entries(new_tran_prams)) {
                // if the property is TranslatableText
                if (value instanceof TranslatableText){
                    // replace the property with the displayText
                    set(new_tran_prams, key, value.toDisplayText(tran, lang))
                }
            }
            return tran.translate(this._translation_key, lang, new_tran_prams)
        }
        return tran.translate(this._translation_key, lang, this._tran_prams)
    }
}

export class TranslatableText {
    public static translationManager: ITranslationManager
    private _elements: TranslatableTextElement[] = []

    static new(translation_key: string, tran_prams?: TranslationParameter): TranslatableText {
        return (new TranslatableText).addRawElement(translation_key, tran_prams)
    }

    addElement(element: TranslatableText){
        this._elements.push(...element._elements)
        return this
    }

    addRawElement(translation_key: string, tran_prams?: TranslationParameter): TranslatableText {
        this._elements.push(new TranslatableTextElement(translation_key, tran_prams))
        return this
    }

    toDisplayText(tran?: ITranslationManager, lang?: string){
        if (tran == undefined){
            tran = TranslatableText.translationManager
        }
        return this._elements.map(e => e.toDisplayText(tran as ITranslationManager, lang)).join(" ")
    }
}