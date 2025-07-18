import express from "express";
import {
  fetchRoomsController,
  fetchRoomByIdController,
  createNewRoomController,
  editRoomController,
} from "../controllers/room/room.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  requirePermission,
  requireAdmin,
} from "../middlewares/permission.middleware";

const router = express.Router();

router.use(authMiddleware);

// Admin
router.post("/", requireAdmin, createNewRoomController);
router.put("/:roomId", requireAdmin, editRoomController);

// scheduling permission
router.get("/", requirePermission("scheduling"), fetchRoomsController);
router.get("/:roomId", requirePermission("scheduling"), fetchRoomByIdController);

export default router;
