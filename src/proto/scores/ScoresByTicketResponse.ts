// Original file: src/proto/scores.proto


export interface _scores_ScoresByTicketResponse_CategoryScore {
  'name'?: (string);
  'score'?: (number | string);
}

export interface _scores_ScoresByTicketResponse_CategoryScore__Output {
  'name'?: (string);
  'score'?: (number);
}

export interface ScoresByTicketResponse {
  'ticketId'?: (number);
  'categoryScores'?: (_scores_ScoresByTicketResponse_CategoryScore)[];
}

export interface ScoresByTicketResponse__Output {
  'ticketId'?: (number);
  'categoryScores'?: (_scores_ScoresByTicketResponse_CategoryScore__Output)[];
}
