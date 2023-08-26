import Sequelize, { Model, ModelStatic } from "sequelize";

export class UserModel extends Model {
  declare id: number;
  declare handle: string;
  declare username: string;
  declare email: string;
  declare password: string;

  public override toJSON(): object {
    return {
      id: this.id,
      handle: this.handle,
      username: this.username,
      email: this.email,
    };
  }
}

export default (sequelize: Sequelize.Sequelize): ModelStatic<UserModel> => {
  UserModel.init(
    {
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
    },
    { sequelize, modelName: "users" }
  );
  return UserModel;
};
