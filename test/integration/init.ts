import knex from '../../src/database/connection';

beforeAll(async () => {
  // console.log('Connecting to the database...');
  // await knex.raw('SELECT 1'); // Test the connection
});

afterAll(async () => {
  // console.log('Closing the database connection...');
  // await knex.destroy();
});
