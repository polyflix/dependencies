import { ParsedQuizz } from "../types/quizz.type";

export const mockQuizzFile = `
Pour intenter une action en responsabilité civile délictuelle, que faut-il faire ?
A. avoir subi un dommage causé par la faute d’autrui
B. que le cocontractant n’ait pas respecté le contrat
C. un élément intentionnel
D. avoir été victime d'une infraction
Answer: A
---
Je peux déposer un logiciel à
A. la SACEM
B. la Société des gens de lettres
Answer: B
`;

export const mockQuizzFile2 = `
What is Rust ?
A. A high-level programming language
B. A low-level programming language
Answer: B
---
What is Javascript ?
A. A web programming language
B. A desktop programming language
C. A mobile programming language
D. An IoT programming language
Answers: A,C
`;

export const expectedParsedQuizz2: ParsedQuizz = {
  questions: [
    {
      index: 0,
      label: "What is Rust ?",
      alternatives: [
        {
          label: "A high-level programming language",
          isCorrect: false,
        },
        {
          label: "A low-level programming language",
          isCorrect: true,
        },
      ],
    },
    {
      index: 1,
      label: "What is Javascript ?",
      alternatives: [
        {
          label: "A web programming language",
          isCorrect: true,
        },
        {
          label: "A desktop programming language",
          isCorrect: false,
        },
        {
          label: "A mobile programming language",
          isCorrect: true,
        },
        {
          label: "An IoT programming language",
          isCorrect: false,
        },
      ],
    },
  ],
};

export const expectedParsedQuizz: ParsedQuizz = {
  questions: [
    {
      index: 0,
      label:
        "Pour intenter une action en responsabilité civile délictuelle, que faut-il faire ?",
      alternatives: [
        {
          isCorrect: true,
          label: "avoir subi un dommage causé par la faute d’autrui",
        },
        {
          isCorrect: false,
          label: "que le cocontractant n’ait pas respecté le contrat",
        },
        {
          isCorrect: false,
          label: "un élément intentionnel",
        },
        {
          isCorrect: false,
          label: "avoir été victime d'une infraction",
        },
      ],
    },
    {
      index: 1,
      label: "Je peux déposer un logiciel à",
      alternatives: [
        {
          isCorrect: false,
          label: "la SACEM",
        },
        {
          isCorrect: true,
          label: "la Société des gens de lettres",
        },
      ],
    },
  ],
};
