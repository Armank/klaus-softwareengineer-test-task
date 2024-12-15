import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.db'
    },
    useNullAsDefault: true
  }
};

export default config;
