import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { GetOverallQualityScore } from '../../src/endpoints/overallQualityScore.[get]';
import * as scoreQueries from '../../src/database/queries/score';
import * as validators from '../../src/service/validators';
import { OverallQualityScoreResponse } from '../../src/proto/scores/OverallQualityScoreResponse';
import { TimeRangeRequest } from '../../src/proto/scores/TimeRangeRequest';

jest.mock('../../src/database/queries/score');
jest.mock('../../src/service/validators');

describe('GetOverallQualityScore gRPC Endpoint', () => {
  let mockCall: jest.Mocked<
    ServerUnaryCall<TimeRangeRequest, OverallQualityScoreResponse>
  >;
  let mockCallback: jest.MockedFunction<
    sendUnaryData<OverallQualityScoreResponse>
  >;

  beforeEach(() => {
    // Create mock call and callback
    mockCall = {
      request: {
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      }
    } as any;

    mockCallback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Scenarios', () => {
    it('should calculate overall quality score correctly', async () => {
      (
        scoreQueries.getOverallQualityScoreForPeriod as jest.Mock
      ).mockResolvedValue(85.5);

      await GetOverallQualityScore(mockCall, mockCallback);

      expect(validators.validateDateInputs).toHaveBeenCalledWith(
        '2023-01-01',
        '2023-12-31'
      );

      expect(mockCallback).toHaveBeenCalledWith(null, {
        overallScore: 85.5
      });
    });

    it('should handle zero ratings scenario', async () => {
      (
        scoreQueries.getOverallQualityScoreForPeriod as jest.Mock
      ).mockResolvedValue(0);

      await GetOverallQualityScore(mockCall, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, {
        overallScore: 0
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw an error when startDate is missing', async () => {
      mockCall.request.startDate = '';

      await GetOverallQualityScore(mockCall, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Both startDate and endDate must be provided.'
        }),
        null
      );
    });
  });
});
