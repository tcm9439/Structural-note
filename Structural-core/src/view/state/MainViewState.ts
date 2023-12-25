import { Note } from "@/note/Note.js"
import { AppState } from "@/view/state/AppState.js"

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
            case AppPage.SETTING:
                return "/setting"
            default:
                return "/"
        }
    }
}

export class MainViewState {
    private _editing_note: Note | null = null
    private _save_path: string | null = null
    private _last_page: AppPage = AppPage.HOME

    get editing_note_name(): string {
        return this._editing_note?.title ?? AppState.translationManager.translate("structural.file.untitled")
    }

    set editing_note(note: Note | null) {
        this._editing_note = note
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
}