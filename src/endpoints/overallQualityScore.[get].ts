import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { TimeRangeRequest } from '../proto/scores/TimeRangeRequest';
import { OverallQualityScoreResponse } from '../proto/scores/OverallQualityScoreResponse';

export function GetOverallQualityScore(
  call: ServerUnaryCall<TimeRangeRequest, OverallQualityScoreResponse>,
  callback: sendUnaryData<OverallQualityScoreResponse>
) {
  callback(null, { overallScore: '1', categoryBreakdowns: {} });
}
