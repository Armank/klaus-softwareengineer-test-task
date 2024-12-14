import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { TimeRangeRequest } from '../proto/scores/TimeRangeRequest';
import { AggregatedScoresResponse } from '../proto/scores/AggregatedScoresResponse';

export function GetAggregatedCategoryScores(
  call: ServerUnaryCall<TimeRangeRequest, AggregatedScoresResponse>,
  callback: sendUnaryData<AggregatedScoresResponse>
) {
  callback(null, { scores: [{ date: '123456', categoryScores: {} }] });
}
