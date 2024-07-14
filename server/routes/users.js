import express from "express";

import {
    getAllUsers,
    createNewUser,
    deleteUser,
    updateEmailById,
    updatePasswordById,
    updateUsernameById,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/", createNewUser);

router.patch("/edit-username/:id", updateUsernameById);
router.patch("/edit-email/:id", updateEmailById);
router.patch("/edit-password/:id", updatePasswordById);

router.delete("/:id", deleteUser);

export default router;
