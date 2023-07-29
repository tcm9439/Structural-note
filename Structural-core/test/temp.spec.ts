import { describe, it, expect } from "vitest";
import { sum } from "@/temp";

describe("test to prove the env is setup properly", () => {
    it("sum", () => {
        expect(sum(1, 2)).toEqual(3);
    });
});
