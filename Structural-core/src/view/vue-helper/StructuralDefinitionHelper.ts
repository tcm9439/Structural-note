import { IViewUITableColumn, IViewUITableData } from "@/view/ViewTypes"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"

export class StructuralDefinitionHelper {
    static readonly ATTR_TABLE_COLUMNS: IViewUITableColumn[] = [
        {
            title: 'Name',
            slot: 'name',
        },
        {
            title: 'Type',
            key: 'type',
        },
        {
            title: 'Description',
            key: 'description',
        },
        {
            title: 'Action',
            slot: 'action',
            width: 125,
        }
    ]

    static readonly DISPLAY_KEY_TABLE_COLUMNS: IViewUITableColumn[] = [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'Name',
            slot: 'name',
        },
        {
            title: 'Action',
            slot: 'action',
        }
    ]

    public static getAttributesInTableFormat(struct_def: StructureDefinition): IViewUITableData {
        let data: IViewUITableData[] = []
        struct_def.attributes.ordered_components.forEach((attribute) => {
            data.push({
                id: attribute.id,
                name: attribute.name,
                type: attribute.attribute_type?.type,
                description: attribute.description,
            })
        })
        return data
    }

    public static getDisplayKeyInTableFormat(struct_def: StructureDefinition): IViewUITableData {
        let data: IViewUITableData[] = []
        // added keys
        struct_def.display_key.ordered_keys.forEach((attribute) => {
            data.push({
                id: attribute.id,
                name: attribute.name,
                selected: true,
                _checked: true,
            })
        })

        // available keys
        struct_def.attributes.ordered_components.forEach((attribute) => {
            if (!struct_def.display_key.hasKey(attribute) && struct_def.display_key.isAllowedAttr(attribute)){
                data.push({
                    id: attribute.id,
                    name: attribute.name,
                    selected: false,
                })
            }
        })
        return data
    }
}