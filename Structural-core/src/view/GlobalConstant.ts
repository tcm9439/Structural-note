export class EventConstant {
    public static readonly LAYOUT_UPDATE = "LAYOUT_UPDATE_EVENT"
    
    public static readonly SETTING_UPDATED = "SETTING_UPDATED_EVENT"
    public static readonly NOTE_OPENED = "NOTE_OPENED_EVENT"
    public static readonly NOTE_CLOSED = "NOTE_CLOSED_EVENT"

    public static readonly ATTR_DEF_UPDATE = "ATTR_DEF_UPDATE_EVENT"
    public static readonly SECTION_UPDATE = "SECTION_UPDATE_EVENT"
    public static readonly ATTR_VALUE_UPDATE = "ATTR_VALUE_UPDATE_EVENT"

    public static readonly ADD_SECTION = "ADD_SECTION_EVENT"
    public static readonly REMOVE_SECTION = "REMOVE_SECTION_EVENT"
    public static readonly MV_UP_SECTION = "MV_UP_SECTION_EVENT"
    public static readonly MV_DOWN_SECTION = "MV_DOWN_SECTION_EVENT"

    public static readonly APP_ERROR = "APP_ERROR_EVENT"
}

export class ShortcutKeyPressEvent {
    public static readonly SAVE = "SAVE_SHORTCUT_PRESS_EVENT"
    public static readonly UNDO = "UNDO_SHORTCUT_PRESS_EVENT"
    public static readonly REDO = "REDO_SHORTCUT_PRESS_EVENT"
}

export class InjectConstant {
    public static readonly EDITING_NOTE = "EDITING_NOTE"
}
