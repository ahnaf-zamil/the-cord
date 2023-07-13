import Sequelize from "sequelize";

export default (sequelize: Sequelize.Sequelize) => {
  return sequelize.define("guilds", {
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
  });
};
