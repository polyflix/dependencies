import { Block } from "./block.model";

describe("Block", () => {
  describe("default()", () => {
    it("Should return a default block instance", () => {
      const block = Block.default(1);
      expect(block).toBeInstanceOf(Block);
      expect(block.sequence).toBe(1);
    });
  });
});
