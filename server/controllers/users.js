import bcrypt from "bcrypt";

import {
    getAllUsers as getAllUsersModel,
    getUserByUsername as getUserByUsernameModel,
    getUserByEmail as getUserByEmailModel,
    getUserById as getUserByIdModel,
    createNewUser as createNewUserModel,
    deleteUserById as deleteUserByIdModel,
} from "../models/users.js";

export const getAllUsers = async (req, res) => {
    try {
        const [data] = await getAllUsersModel();

        if (data.length <= 0)
            return res.status(200).json({
                data,
            });

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        res.status(505).json({
            message: "Something wrong",
            error: error.message,
        });
    }
};

export const createNewUser = async (req, res) => {
    try {
        const { body } = req;
        const saltRounds = 10;
        const [foundUsername] = await getUserByUsernameModel(body.username);
        const [foundEmail] = await getUserByEmailModel(body.email);

        if (foundUsername.length > 0)
            return res.status(401).json({
                message: "Username sudah digunakan",
            });

        if (foundEmail.length > 0)
            return res.status(401).json({
                message: "Email sudah digunakan",
            });

        const hashedPassword = await bcrypt.hash(body.password, saltRounds);

        const data = {
            email: body.email,
            username: body.username,
            password: hashedPassword,
            refresh_token: body.refresh_token,
        };

        await createNewUserModel(data);

        res.status(200).json({
            message: "Success",
            data: {
                email: data.email,
                username: data.username,
            },
        });
    } catch (error) {
        res.status(505).json({
            message: "Something wrong",
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [foundId] = await getUserByIdModel(id);

        if (foundId.length <= 0)
            return res.status(401).json({
                message: "Id tidak ditemukan",
            });

        await deleteUserByIdModel(id);

        res.status(200).json({
            message: "Success deleted user",
            foundId,
        });
    } catch (error) {
        res.status(505).json({
            message: "Something wrong",
            error: error.message,
        });
    }
};
