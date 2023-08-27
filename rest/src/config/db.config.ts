import { DataSourceOptions } from "typeorm";

export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "the_cord",
  password: "the_cord123",
  database: "the_cord",
  synchronize: true,
  logging: true,
} as DataSourceOptions;
