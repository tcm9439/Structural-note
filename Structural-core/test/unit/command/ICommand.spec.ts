import { describe, it, expect, beforeEach } from "vitest"
import { CommandHistory, ICommand } from "@/index.js"
import { ValueUpdateCommand } from "@/command/ValueUpdate.js"

class Temp {
    public value: number = 0
}

describe("Command History", () => {
	it("basic command history with ValueUpdateCommand", () => {
        let temp = new Temp()
        let command_history = new CommandHistory(5)
        command_history.push(ValueUpdateCommand.new(temp, "value", 1))
        expect(temp.value).toBe(1)
        command_history.undo()
        expect(temp.value).toBe(0)
	})

    it("complicated command history with ValueUpdateCommand", () => {
        let temp = new Temp()
        let command_history = new CommandHistory(5)
        expect(command_history.length()).toBe(0)

        command_history.push(ValueUpdateCommand.new(temp, "value", 1))
        expect(temp.value).toBe(1)
        expect(command_history.length()).toBe(1)

        command_history.push(ValueUpdateCommand.new(temp, "value", 3))
        expect(temp.value).toBe(3)
        expect(command_history.length()).toBe(2)

        command_history.undo()
        expect(temp.value).toBe(1)

        command_history.redo()
        expect(temp.value).toBe(3)

        command_history.push(ValueUpdateCommand.new(temp, "value", 4))
        expect(temp.value).toBe(4)
        expect(command_history.length()).toBe(3)

        command_history.undo()
        expect(temp.value).toBe(3)

        command_history.undo()
        expect(temp.value).toBe(1)
        expect(command_history.length()).toBe(3)

        command_history.undo()
        expect(temp.value).toBe(0)
        // exceed history => no change
        command_history.undo()
        expect(temp.value).toBe(0)
        command_history.undo()
        expect(temp.value).toBe(0)

        command_history.redo()
        expect(temp.value).toBe(1)
        command_history.redo()
        expect(temp.value).toBe(3)
        command_history.redo()
        expect(temp.value).toBe(4)
        expect(command_history.length()).toBe(3)
        // exceed history => no change
        command_history.redo()
        expect(temp.value).toBe(4)
        command_history.redo()
        expect(temp.value).toBe(4)
	})

    it("command history with size limit", () => {
        let temp = new Temp()
        let command_history = new CommandHistory(5)
        expect(command_history.length()).toBe(0)

        command_history.push(ValueUpdateCommand.new(temp, "value", 1))
        command_history.push(ValueUpdateCommand.new(temp, "value", 2))
        command_history.push(ValueUpdateCommand.new(temp, "value", 3))
        command_history.push(ValueUpdateCommand.new(temp, "value", 4))
        command_history.push(ValueUpdateCommand.new(temp, "value", 5))
        command_history.push(ValueUpdateCommand.new(temp, "value", 6))
        command_history.push(ValueUpdateCommand.new(temp, "value", 7))
        expect(command_history.length()).toBe(5)
        expect(temp.value).toBe(7)

        command_history.undo()
        expect(temp.value).toBe(6)
        command_history.undo()
        expect(temp.value).toBe(5)
        command_history.undo()
        expect(temp.value).toBe(4)
        command_history.undo()
        expect(temp.value).toBe(3)
        command_history.undo()
        expect(temp.value).toBe(2)
        command_history.undo()
        expect(temp.value).toBe(2)
        command_history.undo()
        expect(temp.value).toBe(2)
    })

    it("complicated command history override later undo", () => {
        let temp = new Temp()
        let command_history = new CommandHistory(5)
        expect(command_history.length()).toBe(0)

        command_history.push(ValueUpdateCommand.new(temp, "value", 1))
        expect(temp.value).toBe(1)
        expect(command_history.length()).toBe(1)

        command_history.push(ValueUpdateCommand.new(temp, "value", 3))
        expect(temp.value).toBe(3)
        expect(command_history.length()).toBe(2)

        command_history.undo()
        expect(temp.value).toBe(1)

        command_history.push(ValueUpdateCommand.new(temp, "value", 4))
        expect(temp.value).toBe(4)
        expect(command_history.length()).toBe(2)

        command_history.undo()
        expect(temp.value).toBe(1)

        command_history.undo()
        expect(temp.value).toBe(0)
        expect(command_history.length()).toBe(2)

        // exceed history => no change
        command_history.undo()
        expect(temp.value).toBe(0)

        command_history.redo()
        expect(temp.value).toBe(1)
        command_history.redo()
        expect(temp.value).toBe(4)
        expect(command_history.length()).toBe(2)
        // exceed history => no change
        command_history.redo()
        expect(temp.value).toBe(4)
	})
})
