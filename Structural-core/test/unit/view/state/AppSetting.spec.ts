import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { AppState, ModuleInit, AppSetting } from "@/index.js"

describe("AppSetting", () => {
    beforeAll(() => {
        ModuleInit.init()
    })

    it("set lang", () => {
        const setting = new AppSetting()
        // existing lang
        setting.language = "zh-HK"
        expect(setting.language).toBe("zh-HK")
        expect(AppState.translationManager.default_language_code).toBe("zh-HK")

        // non-existing lang
        setting.language = "www"
        expect(setting.language).toBe("zh-HK")
        expect(AppState.translationManager.default_language_code).toBe("zh-HK")
    })

	it("clone & equal", () => {
        const setting = new AppSetting()
        setting.language = "en"
        const cloned = setting.clone()
        expect(cloned.equals(setting)).toBe(true)
        expect(cloned).not.toBe(setting)
	})
})
