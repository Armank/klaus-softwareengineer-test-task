import knex from '../connection';

export async function findRatingsWithCategories(
  startDate: string,
  endDate: string
) {
  return knex.raw(
    `
      SELECT *
      FROM ratings AS r
      LEFT JOIN rating_categories rc
      ON (r.rating_category_id = rc.id)
      WHERE r.created_at >= :startDate
      AND r.created_at <= :endDate
      ORDER BY r.created_at
    `,
    { startDate, endDate }
  );
}

export async function findTicketsWithCategories(
  startDate: string,
  endDate: string
) {
  // return knex.raw(
  //   `
  //   SELECT
  //   t.id AS ticket_id,
  //   r.id AS rating_id,
  //   r.rating AS rating_value,
  //   rc.name AS rating_category_name
  //   FROM tickets t
  //   JOIN ratings r ON (t.id = r.ticket_id)
  //   JOIN rating_categories rc ON (r.rating_category_id = rc.id)
  //   WHERE t.created_at >= ?
  //   AND t.created_at <= ?
  //   ORDER BY t.created_at
  // `,
  //   [startDate, endDate]
  // );

  return knex.raw(
    `
    SELECT
    t.id AS ticket_id,
    rc.name AS category_name,
    SUM(r.rating * rc.weight) AS category_score,
    SUM(rc.weight) AS total_weight
    FROM tickets t
    JOIN ratings r ON t.id = r.ticket_id
    JOIN rating_categories rc ON r.rating_category_id = rc.id
    WHERE r.created_at >= :startDate
      AND r.created_at <= :endDate
    GROUP BY t.id, rc.name
    ORDER BY t.id, rc.name;
  `,
    { startDate, endDate }
  );
}

export async function getOverallQualityScoreForPeriod(
  startDate: string,
  endDate: string
) {
  const [row] = await knex.raw(
    `
    SELECT
    ROUND(
        (SUM(r.rating * rc.weight) / SUM(rc.weight * 5)) * 100,
        2
    ) AS overall_quality_score
    FROM
        ratings r
    JOIN
        rating_categories rc ON r.rating_category_id = rc.id
    WHERE
        r.created_at >= :startDate
        AND r.created_at <= :endDate;
  `,
    { startDate, endDate }
  );

  return row?.overall_quality_score || 0;
}
