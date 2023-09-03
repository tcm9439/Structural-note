import { ID } from "@/common/CommonTypes"
import { Cloneable } from "@/note/util/Cloneable"
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
export abstract class AttributeType<T> implements Cloneable<AttributeType<T>> {
    private static attrTypes: AttributeType<any>[] = []
    private _type: string
    /**
     * Map of AttrType => { Map of ModeID => Converter }
     */
    private _converters: Map<string, Map<ID, AttributeValueConverter<T, any>>> = new Map()

    constructor(type: string) {
        this._type = type
        AttributeType.attrTypes.push(this)
    }

    static getAttrTypes(): AttributeType<any>[] {
        return AttributeType.attrTypes
    }

    get convertibleTo(): IterableIterator<string> {
        return this.converters.keys()
    }

    get type(): string {
        return this._type
    }

    private get converters(): Map<string, Map<ID, AttributeValueConverter<T, any>>> {
        return this._converters
    }

    isConvertibleTo(type: string): boolean {
        return this.converters.has(type)
    }

    addConvertibleType(type: string, convertFunction: AttributeValueConverter<T, any>, mode: ID = 0): void {
        // check if the type already has > 1 converters
        if (this.converters.has(type)) {
            // add to the TYPE => converter map
            this.converters.get(type)?.set(mode, convertFunction)
        } else {
            // create the TYPE => converter map
            let converter_map = new Map()
            converter_map.set(mode, convertFunction)
            this.converters.set(type, converter_map)
        }
    }

    convertTo<N>(new_attr_type: AttributeType<N>, value: T, mode: ID = 0): N {
        const new_type_str: string = new_attr_type.type

        // return the ori value if they are in the same type
        if (this.type === new_type_str) {
            return value as unknown as N
        }

        if (this.isConvertibleTo(new_type_str)) {
            const converter = this.converters.get(new_type_str)?.get(mode)
            if (converter){
                try {
                    return converter(value, mode)
                } catch (e) {
                    throw new InvalidTypeConversionForDataException(this._type, new_type_str, value)
                }   
            }
        }
        throw new InvalidTypeConversionException(this.type, new_type_str)
    }

    clone(): AttributeType<T> {
        // as the type is singleton, just return itself
        return this
    }

    cloneDeepWithCustomizer(): AttributeType<T> {
        return this
    }
}