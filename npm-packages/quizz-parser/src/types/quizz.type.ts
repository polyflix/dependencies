export interface ParsedQuizz {
  questions: ParsedQuestion[];
}

export interface ParsedQuestion {
  index: number;
  label: string;
  alternatives: ParsedAlternative[];
}

export interface ParsedAlternative {
  label: string;
  isCorrect: boolean;
}
