import { ModelStatic, Sequelize, Model } from "sequelize";
import guildModel from "../models/guild.model";

import dbConf from "../config/db.config";
import userModel from "../models/user.model";

interface IModels {
  [x: string]: ModelStatic<any>;
}

interface IDB {
  sequelize: Sequelize;
  models: IModels;
}

const db: IDB = {
  sequelize: new Sequelize(dbConf.DB, dbConf.USER, dbConf.PASSWORD, {
    host: dbConf.HOST,
    dialect: "postgres",
    pool: dbConf.pool,
  }),
  models: {},
};

db.models.guild = guildModel(db.sequelize);
db.models.user = userModel(db.sequelize);

export default db;
