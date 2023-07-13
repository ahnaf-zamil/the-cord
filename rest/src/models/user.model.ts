import Sequelize from "sequelize";

export default (sequelize: Sequelize.Sequelize) => {
  return sequelize.define("users", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
    },
    handle: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true,
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(72), // Bcrypt hashes are at max 72 chars in length
      allowNull: false,
    },
  });
};
