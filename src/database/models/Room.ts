import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelize } from "../index";

interface RoomAttributes {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  time_block: number;
  createdAt?: Date;
  updatedAt?: Date;
}
interface RoomCreationAttributes extends Optional<RoomAttributes, "id"> { }
class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes {
  public id!: string;
  public name!: string;
  public startTime!: string;
  public endTime!: string;
  public time_block!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init(
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
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "start_time",
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "end_time",
    },
    time_block: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "time_block",
    },
  },
  {
    sequelize,
    modelName: "Room",
    tableName: "rooms",
  }
);
export default Room;
