import { Connection, createConnection } from "typeorm";
import { readEnv } from "../utils/readEnv";
import { IS_PROD } from "../constants";
import { User } from "../entities/User";
import { Card } from "../entities/Card";
readEnv();
const { DB_NAME, DB_USER, DB_PASSWORD, DATABASE_URL } = process.env;

export async function createDbConnection(): Promise<Connection> {
  return createConnection({
    type: "postgres",
    url: IS_PROD ? DATABASE_URL : undefined,
    database: !IS_PROD ? DB_NAME : undefined,
    password: !IS_PROD ? DB_PASSWORD : undefined,
    username: !IS_PROD ? DB_USER : undefined,
    logging: !IS_PROD,
    synchronize: true,
    ssl: IS_PROD,
    extra: IS_PROD && {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    entities: [User, Card],
  });
}
