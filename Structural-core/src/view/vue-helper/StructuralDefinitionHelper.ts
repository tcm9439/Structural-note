import { IViewUITableColumn, IViewUITableData } from "@/view/ViewTypes.js"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition.js"

export class StructuralDefinitionHelper {
    static readonly ATTR_TABLE_COLUMNS: IViewUITableColumn[] = [
        {
            title_key: "structural.struct_def.attr_table_name_col",
            slot: 'name',
        },
        {
            title_key: "structural.struct_def.attr_table_type_col",
            key: 'type',
        },
        {
            title_key: "structural.struct_def.attr_table_description_col",
            key: 'description',
        },
        {
            title_key: "structural.struct_def.attr_table_action_col",
            slot: 'action',
            width: 155,
        }
    ]

    static readonly DISPLAY_KEY_TABLE_COLUMNS: IViewUITableColumn[] = [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title_key: "structural.struct_def.display_name_table_name_col",
            slot: 'name',
        },
        {
            title_key: "structural.struct_def.display_name_table_action_col",
            slot: 'action',
        }
    ]

    // TODO table data translation (type)
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