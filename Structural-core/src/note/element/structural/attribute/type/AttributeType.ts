import { ID } from "@/common/CommonTypes"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { InvalidTypeConversionException, InvalidTypeConversionForDataException } from "@/note/element/structural/attribute/exception/AttributeException"

export interface AttributeValueConverter<OriType,NewType> {
    (value: OriType, mode?: any): NewType
}

/**
 * Singleton
 * Defines
 * - the type of the attribute
 * - the types it can be converted to
 * - the conversion functions
 */
export abstract class AttributeType<T> {
    private _type: string
    /**
     * Map of AttrType => { Map of ModeID => Converter }
     */
    private _converters: Map<string, Map<ID, AttributeValueConverter<T, any>>> = new Map()
    
    constructor(type: string) {
        this._type = type
    }

    get convertibleTo(): IterableIterator<string> {
        return this._converters.keys()
    }

    get type(): string {
        return this._type
    }

    isConvertibleTo(type: string): boolean {
        return this._converters.has(type)
    }

    addConvertibleType(type: string, convertFunction: AttributeValueConverter<T, any>, mode: ID = 0): void {
        // check if the type already has > 1 converters
        if (this._converters.has(type)) {
            // add to the TYPE => converter map
            this._converters.get(type)?.set(mode, convertFunction)
        } else {
            // create the TYPE => converter map
            let converter_map = new Map()
            converter_map.set(mode, convertFunction)
            this._converters.set(type, converter_map)
        }
    }

    convertTo<N>(value: T, new_attr_def: AttributeDefinition<N>, mode: ID = 0): AttributeValue<N> {
        const new_type_str: string = new_attr_def.attributeType.type
        const new_type: AttributeType<any> = new_attr_def.attributeType

        if (this.isConvertibleTo(new_type_str)) {
            const converter = this._converters.get(new_type_str)?.get(mode)
            if (converter){
                try {
                    let converted_value = converter(value, mode)
                    return new_type.create(new_attr_def, converted_value)
                } catch (e) {
                    throw new InvalidTypeConversionForDataException(this._type, new_type_str, value)
                }   
            }
        }
        throw new InvalidTypeConversionException(this._type, new_type_str)
    }

    abstract create(definition: AttributeDefinition<T>, value: T): AttributeValue<T>
}