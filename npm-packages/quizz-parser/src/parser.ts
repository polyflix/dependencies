import { ParseError } from "./errors/parse.error";
import {
  ParsedAlternative,
  ParsedQuestion,
  ParsedQuizz,
} from "./types/quizz.type";

const QUESTION_REGEX =
  /(?<question>[\wéàè,’ '\-?()\[\]:"]+)\n(?:A\.\s?(?<A>[\w\séàè,’ '\-?()\[\]:"]+))(?:B\.\s?(?<B>[\w\séàè,’ '\-?()\[\]:"]+))(?:C\.\s?(?<C>[\w\séàè,’ '\-?()\[\]:"]+))?(?:D\.\s?(?<D>[\w\séàè,’ '\-?()\[\]:"]+))?Answers?:\s?(?<answers>(?:[A-D],?)+)/;

export class QuizzParser {
  /**
   * Parse a Quizz file into objects
   * @param {string} fileContent the content of the quizz file
   * @param {string} separator the questions separator. Default to "---"
   * @returns {ParsedQuizz} the parsed quizz
   */
  static parse(fileContent: string, separator: string = "---"): ParsedQuizz {
    if (fileContent.endsWith(separator))
      throw new ParseError(`The file cannot be terminated by "${separator}".`);

    const splitted = fileContent.split(separator);

    const questions = splitted.map((q, index): ParsedQuestion => {
      try {
        const { groups } = q.match(QUESTION_REGEX);

        const { question, answers } = groups;

        const alternatives = ["A", "B", "C", "D"]
          .map((alt): ParsedAlternative => {
            const label = groups[alt];
            if (label) {
              const isCorrect = answers.includes(alt);
              return {
                label: label.replace(/\n/g, ""),
                isCorrect,
              };
            }
          })
          .filter((alt) => alt);

        return {
          alternatives,
          index,
          label: question,
        };
      } catch (e) {
        throw new ParseError(
          "The file is malformed. Please check your file an ensure it is correct."
        );
      }
    });

    return {
      questions,
    };
  }
}
