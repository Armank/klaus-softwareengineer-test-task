import {
  sendUnaryData,
  ServerErrorResponse,
  ServerUnaryCall
} from '@grpc/grpc-js';
import { validateDateInputs } from '../service/validators';
import { getOverallQualityScoreForPeriod } from '../database/queries/score';
import { TimeRangeRequest } from '../../proto/scores/TimeRangeRequest';
import { OverallQualityScoreResponse } from '../../proto/scores/OverallQualityScoreResponse';

export async function GetOverallQualityScore(
  call: ServerUnaryCall<TimeRangeRequest, OverallQualityScoreResponse>,
  callback: sendUnaryData<OverallQualityScoreResponse>
) {
  try {
    const { startDate, endDate } = call.request;

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate must be provided.');
    }

    validateDateInputs(startDate, endDate);

    const overallScore = await getOverallQualityScoreForPeriod(
      startDate,
      endDate
    );

    callback(null, { overallScore });
  } catch (error: any) {
    callback(
      {
        message: error.message,
        code: error.code
      } as ServerErrorResponse,
      null
    );
  }
}
