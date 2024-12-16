// Original file: src/proto/scores.proto


export interface PeriodChangeResponse {
  'overallScoreChange'?: (number | string);
  'categoryScoreChanges'?: ({[key: string]: number | string});
  'isImprovement'?: (boolean);
}

export interface PeriodChangeResponse__Output {
  'overallScoreChange'?: (number);
  'categoryScoreChanges'?: ({[key: string]: number});
  'isImprovement'?: (boolean);
}
