// Original file: src/proto/scores.proto

export interface TicketScoreDetail {
  ticketId?: string;
  categoryScores?: { [key: string]: number | string };
}

export interface TicketScoreDetail__Output {
  ticketId?: string;
  categoryScores?: { [key: string]: number };
}
