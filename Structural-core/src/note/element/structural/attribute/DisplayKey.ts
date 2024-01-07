import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { OrderedComponents } from "@/note/util/OrderedComponents.js"
import { AttributeTypeEnum } from "./type/AttributeType.js"
import { AttributeDefinition } from "./AttributeDefinition.js"
import { NumberAttribute } from "./type/NumberAttribute.js"

export class DisplayKey {
    public static readonly available_type: AttributeTypeEnum[] = [
        AttributeTypeEnum.STRING,
        AttributeTypeEnum.INT
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
                }
            }
        })
        return result.join(this._separator)
    }
}