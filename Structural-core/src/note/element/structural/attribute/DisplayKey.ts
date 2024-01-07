import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { OrderedComponents } from "@/note/util/OrderedComponents.js"
import { AttributeTypeEnum } from "./type/AttributeType.js"
import { AttributeDefinition } from "./AttributeDefinition.js"
import { NumberAttribute } from "./type/NumberAttribute.js"
import { EnumAttribute } from "./type/EnumAttribute.js"
import { ConstraintType } from "./constraint/Constraint.js"
import { EnumConstraint } from "./constraint/EnumConstraint.js"
import { InvalidDataException, InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition.js"

import { z } from "zod"

export const DisplayKeyJson = z.object({
    keys: z.array(z.string()), // list of attribute definition id
    separator: z.string()
}).required()

export class DisplayKey {
    public static readonly available_type: AttributeTypeEnum[] = [
        AttributeTypeEnum.STRING,
        AttributeTypeEnum.INT,
        AttributeTypeEnum.ENUM,
    ]

    private _keys: OrderedComponents<AttributeDefinition<any>> = new OrderedComponents()
    private _separator: string = "-"

    isAllowedAttr(key: AttributeDefinition<any>): boolean {
        let key_type = key.attribute_type?.type
        if (key_type !== undefined && DisplayKey.available_type.includes(key_type as AttributeTypeEnum)){
            return true
        }
        return false
    }

    hasKey(key: AttributeDefinition<any> | string): boolean {
        if (key instanceof AttributeDefinition){
            return this._keys.has(key.id)
        }
        return this._keys.has(key)
    }

    addKey(key: AttributeDefinition<any>): void {
        if (this.isAllowedAttr(key)){
            this._keys.add(key)
        }
    }
    
    removeKey(key: AttributeDefinition<any> | string): void {
        if (key instanceof AttributeDefinition){
            return this._keys.remove(key.id)
        }
        return this._keys.remove(key)
    }

    removeAll(){
        this._keys.clear()
    }

    get ordered_keys(): AttributeDefinition<any>[] {
        return this._keys.ordered_components
    }

    get keys(): OrderedComponents<AttributeDefinition<any>> {
        return this._keys
    }

    set separator(value: string){
        this._separator = value
    }

    get separator(){
        return this._separator
    }

    getDisplayKey(struct_ele: StructuralElement): string {
        let result: string [] = []
        this._keys.ordered_components.forEach((key) => {
            let value = struct_ele.values.get(key.id)
            if (value !== undefined){
                switch (key.attribute_type?.type){
                    case AttributeTypeEnum.STRING:
                        result.push(value.value)
                        break
                    case AttributeTypeEnum.INT:
                        result.push(NumberAttribute.convertToString(value.value, { precision: 0 }))
                        break
                    case AttributeTypeEnum.ENUM:
                        const enum_constraint = key.getConstraint(ConstraintType.ENUM) as EnumConstraint
                        result.push(EnumAttribute.convertToString(value.value, { 
                            enum: enum_constraint.getAvailableValuesMap()
                        }))
                        break
                }
            }
        })
        return result.join(this._separator)
    }

    saveAsJson(): z.infer<typeof DisplayKeyJson> {
        let keys = this.keys.ordered_components.flatMap((key) => {
            return key.id
        })

        return {
            keys: keys,
            separator: this._separator
        }
    }

    static loadFromJson(json: object, struct_def: StructureDefinition): DisplayKey {
        const result = DisplayKeyJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("Display Key", result.error.toString())
        }
        const valid_json = result.data

        let display_key = new DisplayKey()
        display_key.separator = valid_json.separator
        valid_json.keys.forEach((key_id: string) => {
            let key = struct_def.attributes.get(key_id)
            if (key === undefined){
                throw new InvalidDataException("Display Key", `Attribute definition with id ${key_id} not found in loaded attributes`)
            } else {
                display_key.addKey(key)
            }
        })

        return display_key
    }
}