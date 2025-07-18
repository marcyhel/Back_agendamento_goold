import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelize } from "../index";

interface ReservationAttributes {
  id: string;
  date: Date;
  time: string;
  userId: string;
  roomId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}
interface ReservationCreationAttributes extends Optional<ReservationAttributes, "id"> { }
class Reservation
  extends Model<ReservationAttributes, ReservationCreationAttributes>
  implements ReservationAttributes {
  public id!: string;
  public date!: Date;
  public time!: string;
  public userId!: string;
  public roomId!: string;
  public status!: "pending" | "confirmed" | "cancelled";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "room_id",
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Reservation",
    tableName: "reservation",
  }
);
export default Reservation;
