// Original file: src/proto/scores.proto

export interface CategoryScore {
  date?: string;
  categoryScores?: { [key: string]: number | string };
}

export interface CategoryScore__Output {
  date?: string;
  categoryScores?: { [key: string]: number };
}
