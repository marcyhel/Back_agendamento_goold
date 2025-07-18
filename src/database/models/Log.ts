import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelize } from "../index";

interface LogAttributes {
  id: string;
  userId: string;
  module: "account" | "reservation";
  activity: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LogCreationAttributes extends Optional<LogAttributes, "id"> { }

class Log
  extends Model<LogAttributes, LogCreationAttributes>
  implements LogAttributes {
  public id!: string;
  public userId!: string;
  public module!: "account" | "reservation";
  public activity!: string;
  public details?: string;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Log.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    module: {
      type: DataTypes.ENUM("account", "reservation"),
      allowNull: false,
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "ip_address",
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "user_agent",
    },
  },
  {
    sequelize,
    modelName: "Log",
    tableName: "logs",
  }
);

export default Log;
