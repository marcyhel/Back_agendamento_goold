import { Sequelize } from "sequelize";
import config from "../config/config";

const sequelize = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  dialect: config.database.dialect,
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: config.nodeEnv === "dev" ? console.log : false,
});

export { sequelize };
export default sequelize;
