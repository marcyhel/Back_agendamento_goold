require("dotenv").config();

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

module.exports = {
  development: {
    ...baseConfig,
    database: process.env.DB_NAME,
  },
  production: {
    ...baseConfig,
    database: process.env.DB_NAME,
  },
};
