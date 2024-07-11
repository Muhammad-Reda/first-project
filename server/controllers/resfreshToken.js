import jwt from "jsonwebtoken";
import "dotenv/config";

import { findRefToken as findRefTokenModel } from "../models/auth.js";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const [foundToken] = await findRefTokenModel(refreshToken);

        if (foundToken.length <= 0) return res.sendStatus(403);

        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (err, decode) => {
                if (err) return res.sendStatus(403);
                const paylod = {
                    id: foundToken[0].id,
                    username: foundToken[0].username,
                };

                const accessToken = jwt.sign(
                    paylod,
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: "15s" }
                );
                res.status(200).json({ accessToken });
            }
        );
    } catch (error) {
        res.status(505).json({
            message: "Something wrong",
            error: error.message,
        });
    }
};
