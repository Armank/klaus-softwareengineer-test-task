import { ServerErrorResponse, ServerWritableStream } from '@grpc/grpc-js';
import { validateDateInputs } from '../service/validators';
import { findTicketsWithCategories } from '../database/queries/score';
import { ScoresByTicketResponse } from '../proto/scores/ScoresByTicketResponse';
import { TimeRangeRequest } from '../proto/scores/TimeRangeRequest';

export async function GetScoresByTicket(
  call: ServerWritableStream<TimeRangeRequest, ScoresByTicketResponse>
) {
  try {
    const { startDate, endDate } = call.request;

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate must be provided.');
    }

    validateDateInputs(startDate, endDate);

    const ticketsWithCategories: TicketWithCategory[] =
      await findTicketsWithCategories(startDate, endDate);

    if (ticketsWithCategories.length === 0) {
      call.end();
      return;
    }

    const categoriesByTicket: TicketScoresByCategory = transformData(
      ticketsWithCategories
    );

    writeScoresToStream(categoriesByTicket, call);

    call.end();
  } catch (error: any) {
    handleError(error, call);
  }
}

function transformData(
  ticketsWithCategories: TicketWithCategory[]
): TicketScoresByCategory {
  return ticketsWithCategories.reduce<TicketScoresByCategory>((acc, item) => {
    const { ticket_id, category_name, category_score, total_weight } = item;
    const weightedScore =
      total_weight > 0 && total_weight !== undefined
        ? Math.round((category_score / (total_weight * 5)) * 100)
        : 0;

    if (!acc[ticket_id]) {
      acc[ticket_id] = [];
    }

    acc[ticket_id].push({
      name: category_name,
      score: weightedScore
    });

    return acc;
  }, {});
}

function writeScoresToStream(
  categoriesByTicket: TicketScoresByCategory,
  call: ServerWritableStream<TimeRangeRequest, ScoresByTicketResponse>
): void {
  Object.entries(categoriesByTicket).forEach(([ticketId, categories]) => {
    const response: ScoresByTicketResponse = {
      ticketId: Number(ticketId),
      categoryScores: categories
    };

    call.write(response);
  });
}

function handleError(
  error: Error,
  call: ServerWritableStream<TimeRangeRequest, ScoresByTicketResponse>
): void {
  const serverError = {
    message: error.message,
    code: (error as any).code || 13 // Default to internal error code if not provided
  };
  call.destroy(serverError as ServerErrorResponse);
}

type TicketWithCategory = {
  ticket_id: number;
  category_name: string;
  category_score: number;
  total_weight: number;
};

type TicketScoresByCategory = {
  [ticket_id: number]: Category[];
};

type Category = {
  name: string;
  score: number;
};
