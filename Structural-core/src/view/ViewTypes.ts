import { EditPath } from "@/note/util/EditPath.js"

export type IViewUITableColumn = {
    title?: string,
    type?: string,
    key?: string,
    slot?: string,
    width?: number,
    align?: string,
}

export type IViewUITableData = {
    [key: string]: any
}

export type ComponentVForElement = {
    id: string,
    path: EditPath,
    type: any // vue DefineComponent for component-is
}