import { ServerUnaryCall } from '@grpc/grpc-js';
import { GetPeriodOverPeriodChange } from '../../src/endpoints/periodOverPeriodChange.[get]';
import { getOverallQualityScoreForPeriod } from '../../src/database/queries/score';
import { PeriodChangeResponse } from '../../src/proto/scores/PeriodChangeResponse';
import { PeriodComparisonRequest } from '../../src/proto/scores/PeriodComparisonRequest';

jest.mock('../../src/database/queries/score');
jest.mock('../../src/service/validators');

describe('GetPeriodOverPeriodChange gRPC Endpoint', () => {
  const mockGetOverallQualityScoreForPeriod =
    getOverallQualityScoreForPeriod as jest.Mock;

  let mockCall: jest.Mocked<
    ServerUnaryCall<PeriodComparisonRequest, PeriodChangeResponse>
  >;
  const mockCallback = jest.fn();

  const createMockCall = (request: PeriodComparisonRequest) =>
    ({
      request
    }) as ServerUnaryCall<PeriodComparisonRequest, PeriodChangeResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate score change correctly with valid periods', async () => {
    mockGetOverallQualityScoreForPeriod
      .mockResolvedValueOnce(80) // Score for selected period
      .mockResolvedValueOnce(70); // Score for previous period

    const call = createMockCall({
      selectedPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      previousPeriod: {
        startDate: '2023-12-01',
        endDate: '2023-12-31'
      }
    });

    await GetPeriodOverPeriodChange(call, mockCallback);

    expect(mockGetOverallQualityScoreForPeriod).toHaveBeenCalledTimes(2);
    expect(mockGetOverallQualityScoreForPeriod).toHaveBeenNthCalledWith(
      1,
      '2024-01-01',
      '2024-01-31'
    );
    expect(mockGetOverallQualityScoreForPeriod).toHaveBeenNthCalledWith(
      2,
      '2023-12-01',
      '2023-12-31'
    );

    expect(mockCallback).toHaveBeenCalledWith(null, {
      scoreChange: 14.29
    }); // (80 - 70) / 70 * 100
  });

  it('should return error if selectedPeriod is missing dates', async () => {
    const call = createMockCall({
      selectedPeriod: { startDate: '', endDate: '' },
      previousPeriod: {
        startDate: '2023-12-01',
        endDate: '2023-12-31'
      }
    });

    await GetPeriodOverPeriodChange(call, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          'Both firstPeriodStartDate and firstPeriodEndDate must be provided.'
      }),
      null
    );
  });

  it('should return error if previousPeriod is missing dates', async () => {
    const call = createMockCall({
      selectedPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      previousPeriod: { startDate: '', endDate: '' }
    });

    await GetPeriodOverPeriodChange(call, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          'Both secondPeriodStartDate and secondPeriodEndDate must be provided.'
      }),
      null
    );
  });

  it('should return error if selected period is earlier than previous period', async () => {
    const call = createMockCall({
      selectedPeriod: {
        startDate: '2023-12-01',
        endDate: '2023-12-31'
      },
      previousPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }
    });

    await GetPeriodOverPeriodChange(call, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Selected period must start after the previous period ends.'
      }),
      null
    );
  });

  it('should handle database query failures gracefully', async () => {
    mockGetOverallQualityScoreForPeriod.mockRejectedValueOnce(
      new Error('Database error')
    );

    const call = createMockCall({
      selectedPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      previousPeriod: {
        startDate: '2023-12-01',
        endDate: '2023-12-31'
      }
    });

    await GetPeriodOverPeriodChange(call, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Database error'
      }),
      null
    );
  });

  it('should return 0% score change if previous period score is 0', async () => {
    mockGetOverallQualityScoreForPeriod
      .mockResolvedValueOnce(80) // Score for selected period
      .mockResolvedValueOnce(0); // Score for previous period

    const call = createMockCall({
      selectedPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      previousPeriod: {
        startDate: '2023-12-01',
        endDate: '2023-12-31'
      }
    });

    await GetPeriodOverPeriodChange(call, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(null, { scoreChange: 0 });
  });
});
