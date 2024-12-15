import { ServerErrorResponse, ServerWritableStream } from '@grpc/grpc-js';
import { TimeRangeRequest } from '../proto/scores/TimeRangeRequest';
import { findRatingsWithCategories } from '../database/queries/score';
import { forEach, has, sumBy } from 'lodash';
import { AggregateCategorydScoresResponse } from '../proto/scores/AggregateCategorydScoresResponse';

export async function GetAggregatedCategoryScores(
  call: ServerWritableStream<TimeRangeRequest, AggregateCategorydScoresResponse>
) {
  try {
    const { startDate, endDate } = call.request;

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate must be provided.');
    }

    validateDateInputs(startDate, endDate);

    const ratingsWithCategories = await findRatingsWithCategories(
      startDate,
      endDate
    );

    const categories = aggregateRatingsByCategory(ratingsWithCategories);

    writeCategoryScoresToStream(categories, call);

    call.end();
  } catch (error: any) {
    handleError(error, call);
  }
}

function validateDateInputs(startDate: string, endDate: string): void {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDateRegex.test(startDate)) {
    throw new Error('Invalid startDate format. Expected format: YYYY-MM-DD.');
  }

  if (!isoDateRegex.test(endDate)) {
    throw new Error('Invalid endDate format. Expected format: YYYY-MM-DD.');
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new Error('Start date cannot be later than endDate.');
  }
}

function aggregateRatingsByCategory(
  ratings: RatingWithCategory[]
): GroupedRatings {
  return ratings.reduce((aggregator: GroupedRatings, row) => {
    const { rating_category_id: categoryId, created_at, name, rating } = row;
    const date = new Date(created_at).toLocaleDateString('en-EN');

    if (!aggregator[categoryId]) {
      aggregator[categoryId] = {
        name,
        totalRatings: 0,
        ratingsByDate: {},
        ratingSum: 0
      };
    }

    const category = aggregator[categoryId];

    if (!category.ratingsByDate[date]) {
      category.ratingsByDate[date] = [];
    }

    category.ratingsByDate[date].push(row);
    category.totalRatings++;
    category.ratingSum += rating;

    return aggregator;
  }, {});
}

function writeCategoryScoresToStream(
  categories: GroupedRatings,
  call: ServerWritableStream<TimeRangeRequest, AggregateCategorydScoresResponse>
): void {
  forEach(categories, (category, categoryId) => {
    const categoryScoreByDate = Object.entries(category.ratingsByDate).map(
      ([date, ratings]) => ({
        timeRange: date,
        score: (sumBy(ratings, 'rating') / ratings.length) * 20
      })
    );

    const categoryScoreByInterval: AggregateCategorydScoresResponse = {
      id: Number(categoryId),
      name: category.name,
      ratings: category.totalRatings,
      score: (category.ratingSum / category.totalRatings) * 20,
      categoryScoreByDate
    };

    call.write(categoryScoreByInterval);
  });
}

function handleError(
  error: Error,
  call: ServerWritableStream<TimeRangeRequest, AggregateCategorydScoresResponse>
): void {
  const serverError = {
    message: error.message,
    code: (error as any).code || 13 // Default to internal error code if not provided
  };
  call.destroy(serverError as ServerErrorResponse);
}

type GroupedRatings = {
  [categoryId: string]: {
    name: string;
    totalRatings: number;
    ratingsByDate: {
      [date: string]: RatingWithCategory[];
    };
    ratingSum: number;
  };
};

type RatingWithCategory = {
  id: number;
  rating: number;
  ticket_id: number;
  rating_category_id: number;
  reviewer_id: number;
  reviewee_id: number;
  created_at: string;
  name: string;
  weight: number;
};
