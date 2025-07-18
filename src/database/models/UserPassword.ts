import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelize } from "../index";

interface UserPasswordAttributes {
  id: string;
  userId: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserPasswordCreationAttributes
  extends Optional<UserPasswordAttributes, "id"> {}

class UserPassword
  extends Model<UserPasswordAttributes, UserPasswordCreationAttributes>
  implements UserPasswordAttributes
{
  public id!: string;
  public userId!: string;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserPassword.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: "user_id",
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },
  },
  {
    sequelize,
    modelName: "UserPassword",
    tableName: "user_passwords",
  }
);

export default UserPassword;
