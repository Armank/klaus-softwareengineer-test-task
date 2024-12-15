import knex from '../connection';

export async function findRatingsWithCategories(
  startDate: string,
  endDate: string
) {
  return knex.raw(
    `
      SELECT *
      FROM ratings as r
      LEFT JOIN rating_categories as rc
      ON r.rating_category_id = rc.id
      WHERE r.created_at >= ?
      AND r.created_at <= ?
      ORDER BY r.created_at
    `,
    [startDate, endDate]
  );
}
