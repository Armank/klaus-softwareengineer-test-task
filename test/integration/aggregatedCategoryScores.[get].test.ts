import { ServerWritableStream } from '@grpc/grpc-js/build/src/server-call';
import { TimeRangeRequest } from '../../src/proto/scores/TimeRangeRequest';
import { GetAggregatedCategoryScores } from '../../src/endpoints/aggregatedCategoryScores.[get]';
import { AggregateCategorydScoresResponse } from '../../src/proto/scores/AggregateCategorydScoresResponse';
import * as scoreQueries from '../../src/database/queries/score';

// Mock the database query function
jest.mock('../../src/database/queries/score');

describe('GetAggregatedCategoryScores gRPC Endpoint', () => {
  let mockCall: jest.Mocked<
    ServerWritableStream<TimeRangeRequest, AggregateCategorydScoresResponse>
  >;

  beforeEach(() => {
    mockCall = {
      request: {
        startDate: '2023-01-01',
        endDate: '2023-01-29'
      },
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn()
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Date Validation', () => {
    it('should throw error if startDate is missing', async () => {
      mockCall.request.startDate = '';

      await GetAggregatedCategoryScores(mockCall);

      expect(mockCall.destroy).toHaveBeenCalledWith({
        message: 'Both startDate and endDate must be provided.',
        code: 13
      });
    });

    it('should throw error when endDate is missing', async () => {
      mockCall.request.endDate = '';

      await GetAggregatedCategoryScores(mockCall);

      expect(mockCall.destroy).toHaveBeenCalledWith({
        message: 'Both startDate and endDate must be provided.',
        code: 13
      });
    });

    it('should throw error for invalid startDate format', async () => {
      mockCall.request.startDate = '2023/01/01';

      await GetAggregatedCategoryScores(mockCall);

      expect(mockCall.destroy).toHaveBeenCalledWith({
        message: 'Invalid startDate format. Expected format: YYYY-MM-DD.',
        code: 13
      });
    });

    it('should throw error for invalid endDate format', async () => {
      mockCall.request.endDate = '2023/01/01';

      await GetAggregatedCategoryScores(mockCall);

      expect(mockCall.destroy).toHaveBeenCalledWith({
        message: 'Invalid endDate format. Expected format: YYYY-MM-DD.',
        code: 13
      });
    });

    it('should throw error when start date is later than end date', async () => {
      mockCall.request.startDate = '2023-12-31';
      mockCall.request.endDate = '2023-01-01';

      await GetAggregatedCategoryScores(mockCall);

      expect(mockCall.destroy).toHaveBeenCalledWith({
        message: 'Start date cannot be later than endDate.',
        code: 13
      });
    });
  });

  describe('Successful Scenarios', () => {
    it('should aggregate category scores correctly', async () => {
      const mockRatingsWithCategories = [
        {
          id: 1,
          rating: 4,
          rating_category_id: 1,
          name: 'Communication',
          created_at: '2023-01-15T10:00:00Z'
        },
        {
          id: 2,
          rating: 5,
          rating_category_id: 1,
          name: 'Communication',
          created_at: '2023-01-15T11:00:00Z'
        },
        {
          id: 3,
          rating: 3,
          rating_category_id: 2,
          name: 'Technical Skills',
          created_at: '2023-01-16T10:00:00Z'
        }
      ];

      (scoreQueries.findRatingsWithCategories as jest.Mock).mockResolvedValue(
        mockRatingsWithCategories
      );

      await GetAggregatedCategoryScores(mockCall);

      expect(scoreQueries.findRatingsWithCategories).toHaveBeenCalledWith(
        '2023-01-01',
        '2023-01-29'
      );

      expect(mockCall.write).toHaveBeenCalledTimes(2);

      const communicationScore = mockCall.write.mock.calls[0][0];
      expect(communicationScore).toEqual({
        id: 1,
        name: 'Communication',
        ratings: 2,
        score: 90, // (4.5 * 20)
        categoryScoreByDate: [
          {
            timeRange: new Date(2023, 0, 15).toLocaleDateString('en-EN'),
            score: 90 // (4.5 * 20)
          }
        ]
      });

      const technicalSkillsScore = mockCall.write.mock.calls[1][0];
      expect(technicalSkillsScore).toEqual({
        id: 2,
        name: 'Technical Skills',
        ratings: 1,
        score: 60, // (3 * 20)
        categoryScoreByDate: [
          {
            timeRange: '1/16/2023',
            score: 60 // (3 * 20)
          }
        ]
      });

      expect(mockCall.end).toHaveBeenCalled();
    });

    it('should aggregate ratings by week for periods longer than a month', async () => {
      // Mock request for a period longer than a month
      mockCall.request = {
        startDate: '2024-01-01',
        endDate: '2024-03-01'
      };

      // Mock database response
      const mockRatings = [
        {
          id: 1,
          rating: 4,
          ticket_id: 101,
          rating_category_id: 10,
          reviewer_id: 201,
          reviewee_id: 301,
          created_at: '2024-01-05T00:00:00Z',
          name: 'Customer Service',
          weight: 1
        },
        {
          id: 2,
          rating: 5,
          ticket_id: 102,
          rating_category_id: 10,
          reviewer_id: 202,
          reviewee_id: 302,
          created_at: '2024-01-12T00:00:00Z',
          name: 'Customer Service',
          weight: 1
        },
        {
          id: 3,
          rating: 3,
          ticket_id: 103,
          rating_category_id: 10,
          reviewer_id: 203,
          reviewee_id: 303,
          created_at: '2024-02-15T00:00:00Z',
          name: 'Customer Service',
          weight: 1
        }
      ];

      (scoreQueries.findRatingsWithCategories as jest.Mock).mockResolvedValue(
        mockRatings
      );

      // Call the function
      await GetAggregatedCategoryScores(mockCall);

      expect(mockCall.write).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 10,
          name: 'Customer Service',
          ratings: 3,
          score: 80,
          categoryScoreByDate: expect.arrayContaining([
            expect.objectContaining({
              timeRange: expect.stringMatching(/\d+/),
              score: expect.any(Number)
            })
          ])
        })
      );

      expect(mockCall.end).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty result set', async () => {
      // Mock an empty array of ratings
      (scoreQueries.findRatingsWithCategories as jest.Mock).mockResolvedValue(
        []
      );

      await GetAggregatedCategoryScores(mockCall);

      // Verify no write calls and end is called
      expect(mockCall.write).not.toHaveBeenCalled();
      expect(mockCall.end).toHaveBeenCalled();
    });
  });
});
