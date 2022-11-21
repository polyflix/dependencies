import { ParseError } from "./errors/parse.error";
import {
  expectedParsedQuizz,
  expectedParsedQuizz2,
  mockQuizzFile,
  mockQuizzFile2,
} from "./mocks/quizz.mock";
import { QuizzParser } from "./parser";

describe("QuizzParser", () => {
  describe("parse()", () => {
    it("Should parse a Quizz correctly", () => {
      const quizz = QuizzParser.parse(mockQuizzFile);
      expect(quizz).toStrictEqual(expectedParsedQuizz);

      const quizz2 = QuizzParser.parse(mockQuizzFile2);
      expect(quizz2).toStrictEqual(expectedParsedQuizz2);
    });

    it("Should throw a ParseError if the file is malformed", () => {
      expect(() => QuizzParser.parse(mockQuizzFile.replace(/B/g, "X"))).toThrow(
        ParseError
      );
    });

    it("Should throw a ParseError if the file ends with the separator", () => {
      expect(() => QuizzParser.parse(expectedParsedQuizz + "\n---")).toThrow(
        ParseError
      );
    });
  });
});
