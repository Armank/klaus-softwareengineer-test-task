import { ServerWritableStream } from '@grpc/grpc-js';
import { GetScoresByTicket } from '../../src/endpoints/scoresByTicket.[get]';
import * as scoreQueries from '../../src/database/queries/score';
import * as validators from '../../src/service/validators';
import { ScoresByTicketResponse } from '../../src/proto/scores/ScoresByTicketResponse';
import { TimeRangeRequest } from '../../src/proto/scores/TimeRangeRequest';

jest.mock('../../src/database/queries/score');
jest.mock('../../src/service/validators');

describe('GetScoresByTicket gRPC Endpoint', () => {
  let mockCall: jest.Mocked<
    ServerWritableStream<TimeRangeRequest, ScoresByTicketResponse>
  >;

  beforeEach(() => {
    mockCall = {
      request: {
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      },
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn()
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Scenarios', () => {
    it('should correctly transform and write ticket scores', async () => {
      const mockTicketsWithCategories = [
        {
          ticket_id: 1,
          category_name: 'Communication',
          category_score: 4,
          total_weight: 1
        },
        {
          ticket_id: 1,
          category_name: 'Technical Skills',
          category_score: 5,
          total_weight: 2
        },
        {
          ticket_id: 2,
          category_name: 'Communication',
          category_score: 3,
          total_weight: 1
        }
      ];

      (scoreQueries.findTicketsWithCategories as jest.Mock).mockResolvedValue(
        mockTicketsWithCategories
      );

      await GetScoresByTicket(mockCall);

      expect(scoreQueries.findTicketsWithCategories).toHaveBeenCalledWith(
        '2023-01-01',
        '2023-12-31'
      );

      expect(validators.validateDateInputs).toHaveBeenCalledWith(
        '2023-01-01',
        '2023-12-31'
      );

      expect(mockCall.write).toHaveBeenCalledTimes(2);

      const firstTicketScore = mockCall.write.mock.calls[0][0];
      expect(firstTicketScore).toEqual({
        ticketId: 1,
        categoryScores: [
          {
            name: 'Communication',
            score: 80 // (4 / (1 * 5)) * 100
          },
          {
            name: 'Technical Skills',
            score: 50 // (5 / (2 * 5)) * 100
          }
        ]
      });

      const secondTicketScore = mockCall.write.mock.calls[1][0];
      expect(secondTicketScore).toEqual({
        ticketId: 2,
        categoryScores: [
          {
            name: 'Communication',
            score: 60 // (3 / (1 * 5)) * 100
          }
        ]
      });

      expect(mockCall.end).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should throw an error when startDate is missing', async () => {
      mockCall.request.startDate = '';

      await GetScoresByTicket(mockCall);

      expect(mockCall.destroy).toHaveBeenCalledWith({
        message: 'Both startDate and endDate must be provided.',
        code: 13
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty result set', async () => {
      (scoreQueries.findTicketsWithCategories as jest.Mock).mockResolvedValue(
        []
      );

      await GetScoresByTicket(mockCall);

      expect(mockCall.write).not.toHaveBeenCalled();
      expect(mockCall.end).toHaveBeenCalled();
    });

    it('should handle tickets with zero total weight', async () => {
      const mockTicketsWithCategories = [
        {
          ticket_id: 1,
          category_name: 'Communication',
          category_score: 4,
          total_weight: 0
        }
      ];

      (scoreQueries.findTicketsWithCategories as jest.Mock).mockResolvedValue(
        mockTicketsWithCategories
      );

      await GetScoresByTicket(mockCall);

      expect(mockCall.write).toHaveBeenCalledWith({
        ticketId: 1,
        categoryScores: [
          {
            name: 'Communication',
            score: 0
          }
        ]
      });
    });
  });
});
