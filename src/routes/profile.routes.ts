import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  handleGetPermissions,
  handleGetProfile,
  handleGetUserAgendamentos,
  handleGetUserLogs,
  handleUpdateProfile,
} from "../controllers/profile/profile.controller";
import { requirePermission } from "../middlewares/permission.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", handleGetProfile);
router.put("/", handleUpdateProfile);

router.get("/permission", handleGetPermissions);

router.get("/reservations", requirePermission("scheduling"), handleGetUserAgendamentos);

router.get("/logs", requirePermission("logs"), handleGetUserLogs);

export default router;
