import axios from "axios";
import { Block } from "../models/block.model";
import { Timestamp } from "./timestamp.model";
import { VttBuilder } from "./vtt-builder";

/**
 * Modelize a VttFile.
 * Can be used to parse a VTT file from an URL or from a raw file.
 *
 * @class VttFile
 *
 * @example to parse a VttFile from an URL
 * const vttFile = await VttFile.fromUrl("https://example.com/fr.vtt")
 *
 * @example to parse a VttFile from a raw file
 * const vttFile = VttFile.fromRawFile(`
 * WEBVTT FILE
 * 1
 * 00:00:03.500 --> 00:00:05.000 D:vertical A:start
 * Everyone wants the most from life
 * `)
 */
export class VttFile {
  constructor(private vttFileRaw: string, private blocks?: Block[]) {}

  /**
   * Parse a VTT file from an URL.
   * @param {string} url the VTT file URL
   * @returns {Promise<VttFile>} the parsed vtt file
   */
  static async fromUrl(url: string): Promise<VttFile> {
    try {
      const { data } = await axios.get(url);
      return VttFile.fromRawFile(data);
    } catch (err) {
      throw new Error(`Unable to fetch the VTT file at ${url}`);
    }
  }

  /**
   * Parse a VTT file from raw
   * @param {string} vttFileRaw the VTT file raw
   * @returns {VttFile} the parsed vtt file
   */
  static fromRawFile(vttFileRaw: string): VttFile {
    const vttFile = new VttFile(vttFileRaw);

    const lines = vttFile.asArray();
    const sections = vttFile.toSections(lines);
    const processed = vttFile.processFile(sections);

    return vttFile.setBlocks(processed);
  }

  /**
   * Parse a VTT file from Google API speech to text output
   * @param {string} googleTranscriptData the google API output
   * @returns {string} the string content of vtt file
   */
  static fromGoogleAPI(googleTranscriptData): string {
    let counter = 0;
    let startTime = 0;
    let endTime = 0;
    let phrase = "";
    const phraseLength = 10;
    let start: number;
    const results = googleTranscriptData.results;
    const vttFile = new VttBuilder();
    for (let i = 0; i < results.length; i++) {
      //loop through each word in each transcript
      for (let j = 0; j < results[i].alternatives[0].words.length; j++) {
        const startSeconds = JSON.stringify(
          results[i].alternatives[0].words[j].startTime.seconds.low
        );
        const endSeconds = JSON.stringify(
          results[i].alternatives[0].words[j].endTime.seconds.low
        );
        endTime = +endSeconds;
        let word = JSON.stringify(results[i].alternatives[0].words[j].word);
        word = word.slice(1, word.length - 1);
        if (counter % phraseLength == 1) {
          //first word in line
          startTime = +startSeconds;
          phrase = word;
        }
        if (counter % phraseLength > 1) {
          phrase = phrase.concat(" " + word);
        }
        if (counter % phraseLength == 0) {
          //last word
          phrase = phrase.concat(" ", word);
          vttFile.add(+startTime, +endTime, phrase);
        }
        counter++;
      }
    }
    return vttFile.add(+startTime, +endTime, phrase);
  }

  /**
   * Get VTT file subtitle blocks.
   * @returns {Block[] | undefined} the blocks
   */
  public getBlocks(): Block[] | undefined {
    return this.blocks;
  }

  /**
   * Get the VTT file content in VTT format.
   * @returns {string} the VTT file content
   */
  public getRaw(): string {
    return this.vttFileRaw;
  }

  /**
   * Set the VTT file subtitle blocks.
   * @param {Block[]} blocks an array of blocks
   * @returns {VttFile} the vtt file instance
   */
  private setBlocks(blocks: Block[]): VttFile {
    this.blocks = blocks;
    return this;
  }

  /**
   * Convert the raw VTT file to an array of string.
   * @returns {string[]} the array of vtt file lines
   */
  private asArray(): string[] {
    return this.vttFileRaw.split(/r?\n/).map((line) => line.replace("\r", ""));
  }

  /**
   * Process the VTT file and build each subtitle block.
   * @param {string[][]} blocks the sections array
   * @returns {Block[]} the builded block array
   */
  private processFile(blocks: string[][]): Block[] {
    return blocks.map((block, index) => {
      const processedCue =
        block &&
        block.reduce((cue, string, index) => {
          if (index === 0 && !string.includes("-->")) {
            return cue;
          }

          if (!cue.endTime && string.includes("-->")) {
            const timestamps = Timestamp.fromRaw(string, "-->");
            if (timestamps) {
              cue.startTime = timestamps.startTime;
              cue.endTime = timestamps.endTime;
            }

            return cue;
          }

          cue.text = cue.text + string;
          return cue;
        }, Block.default(index));
      return processedCue;
    });
  }

  /**
   *
   * @param lines
   * @returns
   */
  private toSections(lines: string[]): string[][] {
    return lines
      .reduce(
        (blockArray: string[][], currentLine: string) => {
          if (currentLine === "") {
            blockArray.push([]);
          } else {
            blockArray[blockArray.length - 1].push(currentLine);
          }
          return blockArray;
        },
        [[]]
      )
      .filter((section) => section.length)
      .filter((cueData: string[], index: number) => {
        const [header] = cueData;
        return !(
          header.startsWith("WEBVTT") ||
          header.startsWith("NOTE") ||
          header.startsWith("STYLE")
        );
      });
  }
}
