import {
  mockGoogleTranscript,
  mockVttFile,
  mockVttUrl,
} from "../mocks/vtt.mock";
import { VttFile } from "./vtt-file.model";

describe("VttFile", () => {
  describe("fromUrl()", () => {
    it("Should fetch a VTT file and return a VttFile instance", async () => {
      const vttFile = await VttFile.fromUrl(mockVttUrl);
      console.log(JSON.stringify(vttFile.getBlocks()));

      expect(vttFile).toBeInstanceOf(VttFile);
    });

    it("Should throw an error if an error occured during the HTTP request", async () => {
      const badUrl = mockVttUrl + "x";
      await expect(VttFile.fromUrl(badUrl)).rejects.toThrow(
        `Unable to fetch the VTT file at ${badUrl}`
      );
    });
  });

  describe("fromRawFile()", () => {
    const vttFile = VttFile.fromRawFile(mockVttFile);
    it("Should parse a VTT file and return a VttFile instance", () => {
      expect(vttFile).toBeInstanceOf(VttFile);
    });

    it("Should have the good number of blocks", () => {
      expect(vttFile.getBlocks()).toHaveLength(8);
    });

    it("Should parse every block correctly", () => {
      const isGoodParsing = vttFile.getBlocks().every((block) => {
        return (
          typeof block.text === "string" &&
          typeof block.sequence === "number" &&
          typeof block.startTime === "number" &&
          typeof block.endTime === "number" &&
          !isNaN(block.startTime) &&
          !isNaN(block.endTime)
        );
      });

      expect(isGoodParsing).toBeTruthy();
    });
  });

  describe("fromGoogleAPI()", () => {
    const vttFile = VttFile.fromGoogleAPI(mockGoogleTranscript);
    it("Should create right VTT", () => {
      const expectedValue = `WEBVTT
      
      1
      00:00:00.000 --> 00:00:00.000
      je

      2
      00:00:00.000 --> 00:00:05.000
      veux regarder à tous les coups c'est impossible en fait

      3
      00:00:05.000 --> 00:00:17.000
      mais voilà mais c'était sûr en fait c'est sûr que

      4
      00:00:17.000 --> 00:00:27.000
      je parle bon j'arrête je vais devenir fou`;

      expect(vttFile.replace(/\s/g, "")).toEqual(
        expectedValue.replace(/\s/g, "")
      );
    });
  });
});
