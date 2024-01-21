import { type IViewUITableColumn, AppState } from "@structural-note/structural-core"

/**
 * Translate the column title
 */
export function TableColumnParser(columns: IViewUITableColumn[]): IViewUITableColumn[] {
    return columns.map((column: IViewUITableColumn) => {
        if (!column.title_key) return column
        column.title = AppState.translationManager.translate(column.title_key)
        return column
    })
}