import { Note } from "@/note/Note.js"
import { AppState } from "@/view/state/AppState.js"
import { LoggerManager } from "@/common/Logger.js"
import { CommandHistory } from "@/command/ICommand.js"

export enum AppPage {
    // === PRODUCTION ===
    HOME = "home",
    SETTING = "setting",
    // === TEST ===
    TEST = "test",
    TEST_EMPTY = "test-empty",
}

export class AppPageUtil {
    public static getPageRoute(page: AppPage): string {
        switch (page) {
            case AppPage.HOME:
                return "/"
            case AppPage.TEST:
                return "/test"
            case AppPage.TEST_EMPTY:
                return "/test/empty"
            case AppPage.SETTING:
                return "/setting"
            default:
                return "/"
        }
    }
}

const COMMAND_HISTORY_SIZE = 5

export class MainViewState {
    private _window_id: string = ""
    private _last_saved_note: Note | null = null
    private _editing_note: Note | null = null
    private _save_path: string | null = null
    private _last_page: AppPage = AppPage.HOME
    private _command_history: CommandHistory = new CommandHistory(COMMAND_HISTORY_SIZE)

    get editing_note_name(): string {
        return this._editing_note?.title ?? AppState.translationManager.translate("structural.file.untitled")
    }

    setOpenNote(note: Note){
        LoggerManager.logger.trace("Open note.")
        this._editing_note = note
        this._last_saved_note = note.clone()
        this._save_path = null
        LoggerManager.logger.trace("Reset command history.")
        this._command_history = new CommandHistory(COMMAND_HISTORY_SIZE)
    }

    setSaveNote(){
        this._last_saved_note = this._editing_note?.clone() ?? null
    }

    closeNote(){
        LoggerManager.logger.trace("Close note.")
        this._last_saved_note = null
        this._editing_note = null
        this._save_path = null
        LoggerManager.logger.trace("Reset command history.")
        this._command_history = new CommandHistory(COMMAND_HISTORY_SIZE)
    }

    isNoteChange(): boolean {
        if (this._editing_note && this._last_saved_note){
            return !this._editing_note.equals(this._last_saved_note)
        }
        // no open note
        return false
    }

    hasOpenNote(): boolean {
        return this._editing_note != null
    }

    get editing_note(): Note | null {
        return this._editing_note
    }

    get save_path(): string | null {
        return this._save_path
    }

    set save_path(path: string) {
        this._save_path = path
    }

    get last_page(): AppPage {
        return this._last_page
    }

    set last_page(page: AppPage) {
        this._last_page = page
    }

    get history(): CommandHistory {
        return this._command_history
    }

    set window_id(id: string){
        this._window_id = id
    }

    get window_id(): string {
        return this._window_id
    }
}