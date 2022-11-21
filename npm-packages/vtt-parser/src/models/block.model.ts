/**
 * Modelize a block of subtitle.
 * In a VTT file, we have something like that for a section :
 *
 * 1
 * 00:00:03.500 --> 00:00:05.000
 * Everyone wants the most from life
 *
 * This class aims to modelize this section in another format, like JSON.
 */
export class Block {
  constructor(
    public sequence: number,
    public startTime: number,
    public endTime: number,
    public text: string
  ) {}

  /**
   * Create a default block
   * @param {number} idx the sequence index
   * @returns {Block} the block instance
   */
  static default(idx: number): Block {
    return new Block(idx, 0, 0, "");
  }
}
