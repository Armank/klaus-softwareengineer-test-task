import {
  sendUnaryData,
  ServerErrorResponse,
  ServerUnaryCall
} from '@grpc/grpc-js';
import { TimeRangeRequest } from '../proto/scores/TimeRangeRequest';
import { AggregatedScoresResponse } from '../proto/scores/AggregatedScoresResponse';
import knex from '../database/connection';

export async function GetAggregatedCategoryScores(
  call: ServerUnaryCall<TimeRangeRequest, AggregatedScoresResponse>,
  callback: sendUnaryData<AggregatedScoresResponse>
) {
  try {
    const timeRange = call.request;
    const startDate = timeRange.startDate;
    const endDate = timeRange.endDate;

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate must be provided.');
    }

    validateDateInputs(startDate, endDate);

    const results = await knex.raw(
      `
      SELECT *
      FROM ratings
      WHERE created_at >= ?
      AND created_at < ?
      ORDER BY created_at
      `,
      [startDate, endDate]
    );

    callback(null, { scores: [{ date: '123456', categoryScores: {} }] });
  } catch (error) {
    callback(error as ServerErrorResponse, null);
  }
}

function validateDateInputs(startDate: string, endDate: string) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDateRegex.test(startDate)) {
    throw new Error('Invalid startDate format. Expected format: YYYY-MM-DD.');
  }

  if (!isoDateRegex.test(endDate)) {
    throw new Error('Invalid endDate format. Expected format: YYYY-MM-DD.');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new Error('Start date cannot be later than endDate.');
  }
}
