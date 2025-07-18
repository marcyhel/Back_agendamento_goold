import User from "./User";
import UserPassword from "./UserPassword";
import Address from "./Address";
import Room from "./Room";
import Reservation from "./Reservation";
import Log from "./Log";

User.hasOne(UserPassword, {
  foreignKey: "userId",
  as: "password",
});

UserPassword.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(Address, {
  foreignKey: "userId",
  as: "address",
  constraints: false,
});

Address.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  constraints: false,
});

User.hasMany(Reservation, {
  foreignKey: "userId",
  as: "reservations",
});

Reservation.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Room.hasMany(Reservation, {
  foreignKey: "roomId",
  as: "reservations",
});

Reservation.belongsTo(Room, {
  foreignKey: "roomId",
  as: "room",
});

User.hasMany(Log, {
  foreignKey: "userId",
  as: "logs",
});

Log.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { User, UserPassword, Address, Room, Reservation, Log };

export default {
  User,
  UserPassword,
  Address,
  Room,
  Reservation,
  Log,
};
