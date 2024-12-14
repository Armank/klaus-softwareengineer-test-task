// Original file: src/proto/scores.proto

export interface OverallQualityScoreResponse {
  overallScore?: number | string;
  categoryBreakdowns?: { [key: string]: number | string };
}

export interface OverallQualityScoreResponse__Output {
  overallScore?: number;
  categoryBreakdowns?: { [key: string]: number };
}
