import { describe, it, expect, beforeEach } from "vitest"
import { EditPath, EndOfEditPathError, EditPathStep, EditPathNode } from "@/note/util/EditPath"
import { UUID } from "@/common/CommonTypes"

class TestNode implements EditPathNode {
    id: UUID
    children: Map<UUID,EditPathNode> = new Map()

    constructor(id: UUID){
        this.id = id
    }

    getNextEditPathNode(index: UUID): EditPathNode | undefined {
        return this.children.get(index)
    }
}

describe("EndOfEditPathError", () => {
	it("constructor", () => {
        const error = new EndOfEditPathError()
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe("Reached the end of the edit path.")

        const error2 = new EndOfEditPathError("<test>")
        expect(error2).toBeInstanceOf(Error)
        expect(error2.message).toBe("Reached the end of the edit path. <test> is the last element.")
	})
})

describe("EditPathNode", () => {
	it("constructor", () => {
        let node = new TestNode("123-435-666")
        expect(node).toBeInstanceOf(TestNode)
	})
})

describe("EditPathStep", () => {
	it("constructor", () => {
        let step = new EditPathStep("123-435-666")
        expect(step).toBeInstanceOf(EditPathStep)
        expect(step.index).toBe("123-435-666")
	})
})

describe("EditPath", () => {
    let root: TestNode
    let path: EditPath
    let children: TestNode[]

    beforeEach(() => {
        root = new TestNode("root")
        children = []
        children.push(new TestNode(""))
        children.push(new TestNode("child1.2"))
        children.push(new TestNode("child1.2"))
        children.push(new TestNode("child2.1"))
        children.push(new TestNode("child2.3"))

        root.children.set("1", children[1])
        root.children.set("2", children[2])
        children[1].children.set("3", children[3])
        children[1].children.set("4", children[4])

        path = new EditPath(root)
    })

	it("constructor", () => {
        expect(path).toBeInstanceOf(EditPath)
	})

	it("get root", () => {
        expect(path.root).toBe(root)
	})

    it("addStep", () => {
        path.addStep("1")
        expect(path["_path"]).toEqual([new EditPathStep("1")])
        path.addStep("3")
        expect(path["_path"]).toEqual([new EditPathStep("1"), new EditPathStep("3")])
    })

    it("getNodeByPath case 1 (normal)", () => {
        path.addStep("1")
        expect(path.getNodeByPath()).toBe(children[1])
        path.addStep("3")
        expect(path.getNodeByPath()).toBe(children[3])
    })

    it("getNodeByPath case 2 (normal)", () => {
        path.addStep("1")
        expect(path.getNodeByPath()).toBe(children[1])
        path.addStep("4")
        expect(path.getNodeByPath()).toBe(children[4])
    })

    it("getNodeByPath case 3 (end of path / wrong index)", () => {
        path.addStep("2")
        expect(path.getNodeByPath()).toBe(children[2])
        path.addStep("4")
        expect(() => path.getNodeByPath()).toThrow(EndOfEditPathError)
    })
    
})
