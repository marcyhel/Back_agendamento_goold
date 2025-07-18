import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/permission.middleware";
import {
  handleGetUsers,
  handleGetUserById,
  handleGetUserPermissions,
  handleUpdatePermissions,
  handleChangeUserStatus,
} from "../controllers/user/user.controller";

const router = express.Router();


router.get("", authMiddleware, requireAdmin, handleGetUsers);
router.get("/:userId", authMiddleware, requireAdmin, handleGetUserById);
router.get("/:userId/permissions", authMiddleware, requireAdmin, handleGetUserPermissions);
router.patch("/:userId/permissions", authMiddleware, requireAdmin, handleUpdatePermissions);
router.patch("/:userId/status", authMiddleware, requireAdmin, handleChangeUserStatus);

export default router;
