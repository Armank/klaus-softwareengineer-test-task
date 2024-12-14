import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { TimeRangeRequest } from '../proto/scores/TimeRangeRequest';
import { ScoresByTicketResponse } from '../proto/scores/ScoresByTicketResponse';

export function GetScoresByTicket(
  call: ServerUnaryCall<TimeRangeRequest, ScoresByTicketResponse>,
  callback: sendUnaryData<ScoresByTicketResponse>
) {
  callback(null, { ticketScores: [{ ticketId: '1', categoryScores: {} }] });
}
