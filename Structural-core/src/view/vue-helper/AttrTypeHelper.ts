import { ArrayUtil } from "@/view/vue-helper/ArrayUtil.js"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType.js"

export type AttrTypeChoice = {
    type: AttributeType<any>,
    chosen: boolean
}

export class AttrTypeHelper {
    /**
     * Return a list of all the types.
     * The list will be grouped into sub-lists of the specified length.
     */
    public static getGroupedTypes(chosen_type: string | null, element_in_group: number = 1, padded_with?: any): Array<AttrTypeChoice[]> {
        let types = AttrTypeHelper.getAllTypes()
        let type_choices = types.map(type => {
            return {
                type: type,
                chosen: chosen_type? type.type === chosen_type : false
            }
        })
        return ArrayUtil.group(type_choices, element_in_group, padded_with)
    }

    /**
     * Return a list of all the types that a type can be converted to.
     * The list will be grouped into sub-lists of the specified length.
     */
    public static getGroupedConvertibleTypes(ori_type: AttributeType<any>, chosen_type: string | null, element_in_group: number = 1, padded_with?: any): Array<AttrTypeChoice[]> {
        const convertibleTypes: string[] = [...ori_type.convertibleTo]
        const types = AttrTypeHelper.getAllTypes().filter(type => 
            convertibleTypes.includes(type.type) || type.type === ori_type.type).map(type => {
                return {
                    type: type,
                    chosen: chosen_type? type.type === chosen_type : false
                }
        })
        return ArrayUtil.group(types, element_in_group, padded_with)
    }

    public static getAllTypes(): AttributeType<any>[] {
        return AttributeType.getAttrTypes()
    }
}