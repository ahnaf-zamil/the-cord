import { DataSourceOptions } from "typeorm";

const isDev =
  (process.env.NODE_ENV || "development") == "development" ? true : false;

export default {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || "the_cord",
  password: process.env.POSTGRES_PASS || "the_cord123",
  database: process.env.POSTGRES_DB || "the_cord",
  synchronize: isDev,
  logging: isDev,
} as DataSourceOptions;
