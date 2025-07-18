import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePermission, requireAdmin } from "../middlewares/permission.middleware";
import { fetchAllLogs, fetchLogsByUser, fetchMyLogs } from "../controllers/logs/logs.controller";

const router = express.Router();

router.get("/", authMiddleware, requirePermission("logs"), fetchAllLogs);
router.get("/user/:userId", authMiddleware, requireAdmin, fetchLogsByUser);
router.get("/user", authMiddleware, fetchMyLogs);

export default router;
