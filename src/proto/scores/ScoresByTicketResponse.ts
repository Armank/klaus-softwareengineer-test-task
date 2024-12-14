// Original file: src/proto/scores.proto

import type {
  TicketScoreDetail as _scores_TicketScoreDetail,
  TicketScoreDetail__Output as _scores_TicketScoreDetail__Output
} from '../scores/TicketScoreDetail';

export interface ScoresByTicketResponse {
  ticketScores?: _scores_TicketScoreDetail[];
}

export interface ScoresByTicketResponse__Output {
  ticketScores?: _scores_TicketScoreDetail__Output[];
}
