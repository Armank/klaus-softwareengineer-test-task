import {
  sendUnaryData,
  ServerErrorResponse,
  ServerUnaryCall
} from '@grpc/grpc-js';
import { getOverallQualityScoreForPeriod } from '../database/queries/score';
import { validateDateInputs } from '../service/validators';
import { PeriodChangeResponse } from '../proto/scores/PeriodChangeResponse';
import { PeriodComparisonRequest } from '../proto/scores/PeriodComparisonRequest';
import { TimeRangeRequest } from '../proto/scores/TimeRangeRequest';

export async function GetPeriodOverPeriodChange(
  call: ServerUnaryCall<PeriodComparisonRequest, PeriodChangeResponse>,
  callback: sendUnaryData<PeriodChangeResponse>
) {
  try {
    const { selectedPeriod, previousPeriod } = call.request;

    const {
      startDate: selectedPeriodStartDate,
      endDate: selectedPeriodEndDate
    } = selectedPeriod as TimeRangeRequest;

    if (!selectedPeriodStartDate || !selectedPeriodEndDate) {
      throw new Error(
        'Both firstPeriodStartDate and firstPeriodEndDate must be provided.'
      );
    }

    validateDateInputs(selectedPeriodStartDate, selectedPeriodEndDate);

    const {
      startDate: previousPeriodStartDate,
      endDate: previousPeriodEndDate
    } = previousPeriod as TimeRangeRequest;

    if (!previousPeriodStartDate || !previousPeriodEndDate) {
      throw new Error(
        'Both secondPeriodStartDate and secondPeriodEndDate must be provided.'
      );
    }

    validateDateInputs(previousPeriodStartDate, previousPeriodEndDate);
    validatePeriodOrder(selectedPeriodStartDate, previousPeriodEndDate);

    const [selectedPeriodOverallScore, previousPeriodOverallScore] =
      await Promise.all([
        getOverallQualityScoreForPeriod(
          selectedPeriodStartDate,
          selectedPeriodEndDate
        ),
        getOverallQualityScoreForPeriod(
          previousPeriodStartDate,
          previousPeriodEndDate
        )
      ]);

    const scoreChange =
      previousPeriodOverallScore !== 0
        ? Number(
            (
              ((selectedPeriodOverallScore - previousPeriodOverallScore) /
                previousPeriodOverallScore) *
              100
            ).toFixed(2)
          )
        : 0;

    callback(null, {
      scoreChange
    });
  } catch (error: any) {
    const grpcError = {
      message: error.message || 'Internal server error',
      code: error.code || 13
    } as ServerErrorResponse;
    callback(grpcError, null);
  }
}

function validatePeriodOrder(selectedStart: string, previousEnd: string): void {
  const selectedStartDate = new Date(selectedStart);
  const previousEndDate = new Date(previousEnd);

  if (selectedStartDate <= previousEndDate) {
    throw new Error(
      'Selected period must start after the previous period ends.'
    );
  }
}
