import express from "express";
import cors from "cors";
import config from "./config/config";
import { sequelize } from "./database";
import router from "./routes/routes";
import { errorHandler } from "./utils/error_handler";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    app.listen(config.port, () => {
      console.log(`Servidor rodando na porta ${config.port}`);
      console.log(`Ambiente: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    process.exit(1);
  }
};

startServer();
