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
    private _editing_note: Note | null = null
    private _save_path: string | null = null
    private _last_page: AppPage = AppPage.HOME
    private _command_history: CommandHistory = new CommandHistory(COMMAND_HISTORY_SIZE)

    get editing_note_name(): string {
        return this._editing_note?.title ?? AppState.translationManager.translate("structural.file.untitled")
    }

    set editing_note(note: Note | null) {
        this._editing_note = note
        // reset command history
        LoggerManager.logger.debug("Reset command history.")
        this._command_history = new CommandHistory(COMMAND_HISTORY_SIZE)
    }

    get editing_note(): Note | null {
        return this._editing_note
    }

    get save_path(): string | null {
        return this._save_path
    }

    set save_path(path: string | null) {
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
}