import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { PeriodComparisonRequest } from '../proto/scores/PeriodComparisonRequest';
import { PeriodChangeResponse } from '../proto/scores/PeriodChangeResponse';

export function GetPeriodOverPeriodChange(
  call: ServerUnaryCall<PeriodComparisonRequest, PeriodChangeResponse>,
  callback: sendUnaryData<PeriodChangeResponse>
) {
  callback(null, {
    overallScoreChange: '1',
    categoryScoreChanges: {},
    isImprovement: true
  });
}
