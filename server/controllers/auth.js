import {
    login as loginModel,
    register as registerModel,
    updateToken as updateTokenModel,
} from "../models/auth.js";

import {
    getUserByUsername as getUserByUsernameModel,
    getUserByEmail as getUserByEmailModel,
} from "../models/users.js";

import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [validUser] = await loginModel(username);

        if (validUser.length <= 0)
            return res
                .status(404)
                .json({ message: "Username tidak ditemukan" });

        const match = await bcrypt.compare(password, validUser[0].password);

        if (!match) return res.status(404).json({ message: "Password salah" });

        const payload = {
            id: validUser[0].id,
            username: validUser[0].username,
        };

        const accessSecret = process.env.JWT_ACCESS_SECRET;
        const refreshSecret = process.env.JWT_REFRESH_SECRET;

        const accessToken = jwt.sign(payload, accessSecret, {
            expiresIn: "15s",
        });

        const refreshToken = jwt.sign(payload, refreshSecret, {
            expiresIn: "1d",
        });

        await updateTokenModel(refreshToken, validUser[0].id);

        const miliSecondsInOneSecond = 1000;
        const secondsInOneMinute = 60;
        const minutesInOneHour = 60;
        const hoursInOneDay = 24;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge:
                hoursInOneDay *
                minutesInOneHour *
                secondsInOneMinute *
                miliSecondsInOneSecond,
        });

        res.status(200).json({
            message: "Success",
            data: {
                id: validUser[0].id,
                email: validUser[0].email,
                username: validUser[0].username,
                createdAt: validUser[0].createdAt,
            },
            accessToken,
        });
    } catch (error) {
        res.status(505).json({
            message: "Something wrong",
            error: error.message,
        });
    }
};

export const register = async (req, res) => {
    try {
        const saltRounds = 10;
        const { body } = req;

        const [foundUsername] = await getUserByUsernameModel(body.username);
        const [foundEmail] = await getUserByEmailModel(body.email);

        if (foundUsername.length > 0 || foundEmail.length > 0)
            return res
                .status(404)
                .json({ message: "Username atau email sudah digunakan" });

        const hashedPassword = await bcrypt.hash(body.password, saltRounds);

        await registerModel(body, hashedPassword);

        res.status(200).json({
            message: "Success",
            data: body,
        });
    } catch (error) {
        res.status(505).json({
            message: "Something wrong",
            error: error.message,
        });
    }
};
