import moment from 'moment';

export const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

export function isMoreThanAMonth(startDate: Date, endDate: Date) {
  const start = moment(startDate);
  const end = moment(endDate);

  return end.diff(start, 'months', true) > 1;
}
