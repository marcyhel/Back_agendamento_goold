import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelize } from "../index";

interface UserAttributes {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  canViewLogs: boolean;
  canManageScheduling: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public lastName!: string;
  public email!: string;
  public role!: "user" | "admin";
  public status!: "active" | "inactive";
  public canViewLogs!: boolean;
  public canManageScheduling!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public hasPermission(permission: "logs" | "scheduling"): boolean {
    if (this.role === "admin") return true;

    switch (permission) {
      case "logs":
        return this.canViewLogs;
      case "scheduling":
        return this.canManageScheduling;
      default:
        return false;
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    canViewLogs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "can_view_logs",
    },
    canManageScheduling: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "can_manage_scheduling",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;
