import { describe, it, expect, beforeEach } from "vitest"
import { OrderedList } from "@/common/OrderedList.js"
import { OrderedComponents } from '@/note/util/OrderedComponents'
import { Note } from "@/note/Note.js"
import { UUID } from "@/common/CommonTypes.js"
import { AddComponentsCommand, RemoveComponentsCommand } from "@/index.js"
import _ from "lodash"

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

    it('addBefore', () => {
        const note = new Note("Title 4")
        components.addBefore(note, notes[0].id)
        notes.push(note)
        compareComponentsOrder(components, notes, [3, 0, 1, 2])

        expect(() => components.addBefore(note, notes[0].id)).toThrowError(/already exists/)
        expect(components.length()).toBe(4)
    })

    it('addAfter', () => {
        const note = new Note("Title 4")
        components.addAfter(note, notes[0].id)
        notes.push(note)
        compareComponentsOrder(components, notes, [0, 3, 1, 2])

        expect(() => components.addAfter(note, notes[0].id)).toThrowError(/already exists/)
        expect(components.length()).toBe(4)
    })

    it('remove', () => {
        const note = new Note("Title 4")
        components.add(note)
        notes.push(note)
        compareComponentsOrder(components, notes, [0, 1, 2, 3])

        components.remove(note.id)
        compareComponentsOrder(components, notes, [0, 1, 2])

        expect(() => components.remove(note.id)).toThrowError(/not exist/)
        expect(components.length()).toBe(3)
    })

    it('get', () => {
        const note = new Note("Title 4")
        expect(components.get(note.id)).toBeUndefined()

        components.add(note)
        expect(components.get(note.id)).toBe(note)
    })

    it("override", () => {
        const note = new Note("Title 4")
        expect(() => components.override(note)).toThrowError(/not exist/)
        
        components.add(note)
        expect(components.get(note.id)).toBe(note)
        const note2 = new Note("Title 4")
        _.set(note2, "id", note.id)
        expect(() => components.override(note2)).not.toThrowError(/not exist/)
        expect(components.get(note.id)).toBe(note2)

    })

    it("has", () => {
        const note = new Note("Title 4")
        expect(components.has(note.id)).toBe(false)

        components.add(note)
        expect(components.has(note.id)).toBe(true)
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

    it("get components", () => {
        expect(components.components).toBeInstanceOf(Map)
    })

    it("get order", () => {
        expect(components.order).toBeInstanceOf(OrderedList)
    })
})

describe("EditComponentListCommands", () => {
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

    it("AddComponentsCommand", () => {
        const note = new Note("Title 4")
        notes.push(note)
        const add_command = new AddComponentsCommand(note, components, () => {
            components.add(note)
        })
        add_command.execute()
        expect(components.length()).toBe(4)
        expect(components.get(note.id)).toBe(note)
        compareComponentsOrder(components, notes, [0, 1, 2, 3])
        add_command.undo()
        expect(components.length()).toBe(3)
        expect(components.get(note.id)).toBeUndefined()
        compareComponentsOrder(components, notes, [0, 1, 2])
    })

    it("AddComponentsCommand 2", () => {
        const note = new Note("Title 4")
        notes.push(note)
        const add_command = new AddComponentsCommand(note, components, () => {
            components.addAtPosition(1, note)
        })
        add_command.execute()
        expect(components.length()).toBe(4)
        expect(components.get(note.id)).toBe(note)
        compareComponentsOrder(components, notes, [0, 3, 1, 2])
        add_command.undo()
        expect(components.length()).toBe(3)
        expect(components.get(note.id)).toBeUndefined()
        compareComponentsOrder(components, notes, [0, 1, 2])
    })

    it("RemoveComponentsCommand", () => {
        const remove_command = new RemoveComponentsCommand(notes[1], components)
        remove_command.execute()
        expect(components.length()).toBe(2)
        expect(components.get(notes[1].id)).toBeUndefined()
        compareComponentsOrder(components, notes, [0, 2])
        remove_command.undo()
        expect(components.length()).toBe(3)
        expect(components.get(notes[1].id)).toBe(notes[1])
        compareComponentsOrder(components, notes, [0, 1, 2])
    })

    it("test gc", () => {
        let components = new OrderedComponents()
        let note: Note | null = new Note("Title 1")
        let id = note.id
        components.add(note)
        const remove_command = new RemoveComponentsCommand(note, components)
        note = null
        remove_command.execute()
        expect(components.length()).toBe(0)
        remove_command.undo()
        expect(components.length()).toBe(1)
        expect(components.get(id)).not.toBeNull()
    })

    it("test capture", () => {
        let components = new OrderedComponents()
        let note: Note = new Note("Title 1")
        const add_command = new AddComponentsCommand(note, components, () => {
            components.addAtPosition(1, note)
        })
        add_command.execute()
        note.title = "Title 2"
        add_command.undo()
        add_command.execute()
        expect(components.get(note.id)?.title).toBe("Title 2")
    })
})