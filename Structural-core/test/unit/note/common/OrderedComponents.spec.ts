import { describe, it, expect, beforeEach } from "vitest"
import { OrderedList } from "@/common/OrderedList"
import { OrderedComponents } from '@/note/common/OrderedComponents'
import { Note } from "@/note/Note"
import { UUID } from "@/common/CommonTypes"

function compareComponentsOrder(components: OrderedComponents<Note>, note_ids: Note[], expected_order_index: number[]): void {
    expect(components.length()).toBe(expected_order_index.length)
    for (let i = 0; i < expected_order_index.length; i++) {
        expect(components.order.order[i]).toBe(note_ids[expected_order_index[i]].id)
    }
}

describe('OrderedComponents', () => {
    let components: OrderedComponents<Note>
    let notes: Note[]

    beforeEach(() => {
        components = new OrderedComponents()
        notes = []
        let note: Note = new Note("Title 1")
        components.add(note)
        notes.push(note)

        note = new Note("Title 2")
        components.add(note)
        notes.push(note)

        note = new Note("Title 3")
        components.add(note)
        notes.push(note)
    })

	it('constructor', () => {
        expect(components.length()).toBe(3)
	})

    it('order', () => {
        compareComponentsOrder(components, notes, [0, 1, 2])
    })

    it('add', () => {
        const note = new Note("Title 4")
        components.add(note)
        notes.push(note)
        compareComponentsOrder(components, notes, [0, 1, 2, 3])

        expect(() => components.add(note)).toThrowError(/already exists/)
        expect(components.length()).toBe(4)
    })

    it('remove', () => {
        const note = new Note("Title 4")
        components.add(note)
        notes.push(note)
        compareComponentsOrder(components, notes, [0, 1, 2, 3])

        components.remove(note)
        compareComponentsOrder(components, notes, [0, 1, 2])

        expect(() => components.remove(note)).toThrowError(/not exist/)
        expect(components.length()).toBe(3)
    })

    it('get', () => {
        const note = new Note("Title 4")
        expect(components.get(note.id)).toBeUndefined()

        components.add(note)
        expect(components.get(note.id)).toBe(note)
    })

    it("get ordered components", () => {
        expect(components.ordered_components).toStrictEqual(notes)
    })

    it("orderByList", () => {
        const order = new OrderedList<UUID>()
        order.add(notes[2].id)
        order.add(notes[0].id)
        order.add(notes[1].id)
        expect(OrderedComponents.orderByList(components.components, order)).toStrictEqual([notes[2], notes[0], notes[1]])
    })

    it('moveUp', () => {
        components.moveUp(notes[1])
        compareComponentsOrder(components, notes, [1, 0, 2])

        components.moveUp(notes[0])
        compareComponentsOrder(components, notes, [0, 1, 2])

        components.moveUp(notes[0])
        compareComponentsOrder(components, notes, [0, 1, 2])
    })

    it('moveDown', () => {
        components.moveDown(notes[1])
        compareComponentsOrder(components, notes, [0, 2, 1])

        components.moveDown(notes[0])
        compareComponentsOrder(components, notes, [2, 0, 1])

        components.moveDown(notes[1])
        compareComponentsOrder(components, notes, [2, 0, 1])
    })

    it('getter', () => {
        expect(components.components).toBeInstanceOf(Map)
        expect(components.order).toBeInstanceOf(OrderedList)
    })
})
