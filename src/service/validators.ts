export function validateDateInputs(startDate: string, endDate: string): void {
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
