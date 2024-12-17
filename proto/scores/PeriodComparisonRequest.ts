// Original file: proto/scores.proto

import type { TimeRangeRequest as _scores_TimeRangeRequest, TimeRangeRequest__Output as _scores_TimeRangeRequest__Output } from '../scores/TimeRangeRequest';

export interface PeriodComparisonRequest {
  'selectedPeriod'?: (_scores_TimeRangeRequest | null);
  'previousPeriod'?: (_scores_TimeRangeRequest | null);
}

export interface PeriodComparisonRequest__Output {
  'selectedPeriod'?: (_scores_TimeRangeRequest__Output);
  'previousPeriod'?: (_scores_TimeRangeRequest__Output);
}
