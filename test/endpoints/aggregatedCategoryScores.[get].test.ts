import { ServerErrorResponse } from '@grpc/grpc-js';
import { AggregatedScoresResponse } from '../../src/proto/scores/AggregatedScoresResponse';
import {
  sendUnaryData,
  ServerUnaryCall
} from '@grpc/grpc-js/build/src/server-call';
import { TimeRangeRequest } from '../../src/proto/scores/TimeRangeRequest';
import { GetAggregatedCategoryScores } from '../../src/endpoints/aggregatedCategoryScores.[get]';

describe('/GET aggregatedCategoryScores', () => {
  const createMockCall = (
    startDate: string,
    endDate: string
  ): ServerUnaryCall<TimeRangeRequest, AggregatedScoresResponse> => {
    return {
      request: { startDate, endDate }
    } as ServerUnaryCall<TimeRangeRequest, AggregatedScoresResponse>;
  };

  const createMockCallback = () => {
    return jest.fn() as unknown as sendUnaryData<AggregatedScoresResponse>;
  };

  describe('Date Validation', () => {
    it('should throw error if startDate is missing', () => {
      const call = createMockCall('', '2023-12-31');
      const callback = createMockCallback();

      GetAggregatedCategoryScores(call, callback);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Both startDate and endDate must be provided.'
        }),
        null
      );
    });

    it('should throw error when endDate is missing', () => {
      const call = createMockCall('2023-01-01', '');
      const callback = createMockCallback();

      GetAggregatedCategoryScores(call, callback);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Both startDate and endDate must be provided.'
        }),
        null
      );
    });

    it('should throw error for invalid startDate format', () => {
      const call = createMockCall('2023/01/01', '2023-12-31');
      const callback = createMockCallback();

      GetAggregatedCategoryScores(call, callback);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid startDate format. Expected format: YYYY-MM-DD.'
        }),
        null
      );
    });

    it('should throw error for invalid endDate format', () => {
      const call = createMockCall('2023-01-01', '2023/12/31');
      const callback = createMockCallback();

      GetAggregatedCategoryScores(call, callback);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid endDate format. Expected format: YYYY-MM-DD.'
        }),
        null
      );
    });

    it('should throw error when start date is later than end date', () => {
      const call = createMockCall('2023-12-31', '2023-01-01');
      const callback = createMockCallback();

      GetAggregatedCategoryScores(call, callback);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Start date cannot be later than endDate.'
        }),
        null
      );
    });
  });

  describe.only('Successful Scenarios', () => {
    it('should return aggregated scores for valid date range', async () => {
      const call = createMockCall('2020-02-01', '2020-02-28');
      const callback = createMockCallback();

      await GetAggregatedCategoryScores(call, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        scores: [{ date: '123456', categoryScores: {} }]
      });
    });
  });

  // // Performance and Load Test (Optional)
  // describe('Performance Tests', () => {
  //   test('should handle multiple quick consecutive calls', () => {
  //     const testCalls = [
  //       { startDate: '2023-01-01', endDate: '2023-03-31' },
  //       { startDate: '2023-04-01', endDate: '2023-06-30' },
  //       { startDate: '2023-07-01', endDate: '2023-09-30' }
  //     ];

  //     testCalls.forEach(({ startDate, endDate }) => {
  //       const call = createMockCall(startDate, endDate);
  //       const callback = createMockCallback();

  //       GetAggregatedCategoryScores(call, callback);

  //       expect(callback).toHaveBeenCalledWith(null, {
  //         scores: [{ date: '123456', categoryScores: {} }]
  //       });
  //     });
  //   });
  // });
});
