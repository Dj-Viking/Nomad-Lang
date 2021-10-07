require("dotenv").config();
import { User } from "../../entities/User";
import { Connection, createConnection } from "typeorm";
import { Card } from "../../entities/Card";
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

export async function connectDb(): Promise<Connection> {
  return await createConnection({
    type: "postgres",
    database: DB_NAME as string,
    username: DB_USER as string,
    password: DB_PASSWORD as string,
    logging: false,
    synchronize: true, //usually true during dev
    entities: [User, Card]
  });
}