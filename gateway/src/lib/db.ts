import { Client } from "pg";
import dbConfig from "../config/db.config";

let dbClient: Client | null;

export const getDatabaseClient = async () => {
  // Initialises database client
  if (dbClient) {
    return dbClient;
  }

  dbClient = new Client({
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    port: parseInt(dbConfig.port as string),
  });
  await dbClient.connect();
  console.log("Connected to database");
  return dbClient;
};
