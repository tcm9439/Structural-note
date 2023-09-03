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
}