import Sequelize, { Model } from "sequelize";

export class GuildModel extends Model {
  declare id: number;
  declare name: string;
  declare ownerId: number;
}

export default (sequelize: Sequelize.Sequelize) => {
  GuildModel.init(
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    },
    { sequelize, modelName: "guilds" }
  );

  return GuildModel;
};
