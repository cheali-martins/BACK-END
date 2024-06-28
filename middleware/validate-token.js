import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const checkAndRenewToken = (req, res, next) => {
    const accessToken = req.cookies.access;
    const refreshToken = req.cookies.refresh;

    //logging the cookies
    console.log("the access token => ", accessToken);
    console.log("the refresh token => ", refreshToken);

    // checking the integrity of the access token
    if (!accessToken) {
        //do something

        // to check if the refresh token is still valid
        if (!refreshToken) {
            // do something
            return res.status(403).json({
                success: false,
                message: "Session expired",
            });
        } else {
            // do something else
            //   verify the refresh token
            jwt.verify(
                refreshToken,
                process.env.refresh_secret,
                async (err, decoded) => {
                    if (err) {
                        return res.status(403).json({
                            success: false,
                            message: "Invalid token",
                        });
                    } else {
                        const validUser = await User.findById(decoded?.access2).exec();

                        if (!validUser) {
                            return res.status(404).json({
                                success: false,
                                message: "Invalid User",
                            });
                        }

                        console.log("the valid user => ", validUser);

                        //generate a new access token
                        const accessToken = jwt.sign(
                            {
                                access1: validUser?._id,
                            },
                            process.env.jwt_secret,
                            {
                                expiresIn: process.env.accesstime,
                            }
                        );

                        console.log("the new access token => ", accessToken);

                        res.cookie("access", accessToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            maxAge: 1 * 60 * 1000,
                        });

                        // assignment to look up what the destructuring means
                        const { password, ...rest } = validUser._doc;

                        req.user = rest;
                        next();
                    }
                }
            );
        }
    } else {
        // do another thing
        jwt.verify(accessToken, process.env.jwt_secret, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid token",
                });
            } else {
                const validUser = await User.findById(decoded?.access1).exec();

                if (!validUser) {
                    return res.status(404).json({
                        success: false,
                        message: "Invalid User",
                    });
                }

                console.log("the valid user => ", validUser);

                const { password, ...rest } = validUser._doc;
                req.user = rest;
                next();
            }
        });
    }
};

export const isAdmin = (req, res, next) => {
    const ifReqUserExist = req.user
    if (!ifReqUserExist) {
        res.status(400).json({
            success: false,
            message: "Not an Admin!!!",
        });
        return;
    };

    console.log("Req.user details =", ifReqUserExist);

    // checking if user is an admin
    if (!ifReqUserExist.isAdmin) {
        res.status(403).json({
            success: false,
            message: "Not Authorized!",
        });
        return;
    } else {
        next();
    };
};