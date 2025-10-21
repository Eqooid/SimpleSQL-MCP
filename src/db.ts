import knex from 'knex';

export async function createDbConnection() {
  const DB_TYPE = process.env.DB_TYPE || 'mysql';
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASSWORD = process.env.DB_PASSWORD || '';
  const DB_NAME = process.env.DB_NAME || 'simple_sql_db';
  const SSL = process.env.SSL === 'true';


  return knex({
    client: DB_TYPE,
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: SSL,
    },
  });
}