import express from "express";

import {
    getAllUsers,
    createNewUser,
    deleteUser,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createNewUser);
router.delete("/:id", deleteUser);

export default router;
