import { ArrayUtil } from "@/view/vue-helper/ArrayUtil.js"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType.js"

// TODO translation
export class AttrTypeNameAndInstance {
    private _name: string
    private _instance: AttributeType<any>

    constructor(type_name: string, instance: AttributeType<any>) {
        this._name = type_name
        this._instance = instance
    }

    get name(): string {
        return this._name
    }

    get instance(): AttributeType<any> {
        return this._instance
    }
}

export class AttrTypeHelper {
    /**
     * Return a list of all the types.
     * The list will be grouped into sub-lists of the specified length.
     */
    public static getGroupedTypes(element_in_group: number = 1, padded_with?: any): Array<AttrTypeNameAndInstance[]> {
        const types = AttrTypeHelper.getAllTypes()
        return ArrayUtil.group(types, element_in_group, padded_with)
    }

    /**
     * Return a list of all the types that a type can be converted to.
     * The list will be grouped into sub-lists of the specified length.
     */
    public static getGroupedConvertibleTypes(ori_type: AttributeType<any>, element_in_group: number = 1, padded_with?: any): Array<AttrTypeNameAndInstance[]> {
        const convertibleTypes: string[] = [...ori_type.convertibleTo]
        const types = AttrTypeHelper.getAllTypes().filter(type => convertibleTypes.includes(type.name))
        return ArrayUtil.group(types, element_in_group, padded_with)
    }

    public static getAllTypes(): AttrTypeNameAndInstance[] {
        return AttributeType.getAttrTypes().map(type => new AttrTypeNameAndInstance(type.type, type))
    }
}