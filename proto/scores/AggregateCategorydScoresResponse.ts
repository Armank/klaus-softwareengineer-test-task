// Original file: proto/scores.proto


export interface _scores_AggregateCategorydScoresResponse_CategoryScoreByDate {
  'timeRange'?: (string);
  'score'?: (number | string);
}

export interface _scores_AggregateCategorydScoresResponse_CategoryScoreByDate__Output {
  'timeRange'?: (string);
  'score'?: (number);
}

export interface AggregateCategorydScoresResponse {
  'id'?: (number);
  'name'?: (string);
  'ratings'?: (number);
  'score'?: (number | string);
  'categoryScoreByDate'?: (_scores_AggregateCategorydScoresResponse_CategoryScoreByDate)[];
}

export interface AggregateCategorydScoresResponse__Output {
  'id'?: (number);
  'name'?: (string);
  'ratings'?: (number);
  'score'?: (number);
  'categoryScoreByDate'?: (_scores_AggregateCategorydScoresResponse_CategoryScoreByDate__Output)[];
}
