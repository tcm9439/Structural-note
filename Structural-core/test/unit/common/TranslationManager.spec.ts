import { describe, it, expect, beforeEach } from "vitest"
import { TranslationManager } from "@/common/TranslationManager"

describe('TranslationManager', () => {
    it('translate - no parameter', () => {
        const t = new TranslationManager('en')
        expect(t.translate('test.no_parameter', 'en')).toBe('Hello!')
        expect(t.translate('test.no_parameter', 'zh-HK')).toBe('你好!')
    })

    it('translate - named parameter `max {max:string}`', () => {
        const t = new TranslationManager('en')
        expect(t.translate('test.named_parameter', 'en', { 'name': 'John' })).toBe('Hello John!')
        expect(t.translate('test.named_parameter', 'zh-HK', { 'name': 'John' })).toBe('你好 John!')
        expect(t.translate('test.named_parameter2', 'en', { 'first_name': 'John', 'last_name': 'Doe' })).toBe('Hello John Doe!')
        expect(t.translate('test.named_parameter2', 'zh-HK', { 'first_name': '大文', 'last_name': '陳' })).toBe('你好 陳大文!')
    })

    it('translate - numbered parameter {0} {1}', () => {
        const t = new TranslationManager('en')
        expect(t.translate('test.numbered_parameter', 'en', ['John', 'Doe'])).toBe('Hello John Doe!')
        expect(t.translate('test.numbered_parameter', 'zh-HK', ['大文', '陳'])).toBe('你好 大文 陳!')
        expect(t.translate('test.numbered_parameter2', 'zh-HK', ['大文', '陳'])).toBe('你好 陳 大文!')
    })
})