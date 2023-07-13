import { Model, ModelCtor, ModelDefined, Sequelize } from "sequelize";
import guildModel from "../models/guild.model";

import dbConf from "../config/db.config";
import userModel from "../models/user.model";
import { Literal } from "sequelize/types/utils";

interface IDB {
  sequelize: Sequelize;

  [x: string]: any;
}

const db: IDB = {
  sequelize: new Sequelize(dbConf.DB, dbConf.USER, dbConf.PASSWORD, {
    host: dbConf.HOST,
    dialect: "postgres",
    pool: dbConf.pool,
  }),
};

db.guild = guildModel(db.sequelize);
db.user = userModel(db.sequelize);

export default db;
