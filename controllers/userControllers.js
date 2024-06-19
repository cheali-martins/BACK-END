import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register business logic
const register = async (req, res) => {
    try {
        // lets get the body from the request
        const body = req.body;
        const { name, email, bio, password } = req.body;

        console.log("the body", body);

        // check if required user details are available
        if (!name || !email || !bio || !password) {
            res.status(400).json({
                sucess: false,
                message: "Required fields needed",
            });

            return;
        }

        // check if user already exists
        const userExists = await User.findOne({ email: email }).exec();

        if (userExists) {
            res.status(409).json({
                sucess: false,
                message: "User already exists",
            });
            return;
        }


        // encrypting the password - after checkig the user doesnt exist, the u can create a safe password - npm i bcrypt
        const salt = await bcrypt.genSalt(15);
        const encryptedPassword = await bcrypt.hash(password, salt)


        // const newuser = await User.create(req.body)
        // you can use the object as below incase the field yu are sendign is not the same as the way it is under the user.models.js
        const newuser = await User.create(
            {
                //     (e.g)name: req.body.fullname
                name,
                email,
                bio,
                password: encryptedPassword
            });

        res.status(200).json({
            sucess: true,
            message: "Registered Successfully",
            // user: newuser
        });


    } catch (error) { }
};

// login business logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // checkig if email and password is sent
        if (!email || !password) {
            res.status(409).json({
                sucess: false,
                message: "User already exists",
            });
            return;
        }

        // check if user already exists
        const userExists = await User.findOne({ email: email }).exec();

        if (!userExists) {
            res.status(404).json({
                sucess: false,
                message: "User not found",
            });
            return;
        }

        // compare passwords and check if the password is valid
        const validPassword = await bcrypt.compare(password, userExists.password);

        if (!validPassword) {
            res.status(409).json({
                sucess: false,
                message: "Invalid password",
            });
            return;
        }

        // ToDo: sign a jwt token and produce cookies for access and refresh - npm i jsonwebtoken
        // creating an access token
        const accessToken = jwt.sign(
            {
                access1: userExists?._id,
            },
            process.env.jwt_secret,
            {
                expiresIn: process.env.accesstime,
            }
        );
        console.log("The access token =>", accessToken);

        // refresh token
        const refreshToken = jwt.sign(
            {
                access2: userExists?._id,
            },
            process.env.refresh_secret,
            {
                expiresIn: process.env.refreshtime,
            }
        );
        console.log("The refresh token =>", refreshToken);

        // the cookies - note that u can call the cookies with any name. it is ideal not to make known which iis the access or refresh
        res.cookie("access", accessToken, {
            // httpOnly: true,
            // secure: true,
            sameSite: "none",
            maxAge: 30 * 1000,
            // convert the maxAge to milisec
        })

        res.cookie("refresh", refreshToken, {
            // httpOnly: true,
            // secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
            // convert the maxAge to milisec 5 days, 24 hrs in 5 days, 60 mins in 5 days, 60 seconds in 5 days * 1000.
        })

        res.status(200).json({
            sucess: true,
            message: "Login Sucessful",
        });

    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: "Internal server error",
        });
    }

};



// working on middleware
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).exec();

        res.status(200).json({
            suceess: true,
            message: "Users fetched",
            users,
        });

    } catch (error) {
        res.status(500).json({
            suceess: false,
            message: "Interval server error",
        });
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({
                suceess: false,
                message: "No User",
            });
        }

        res.status(200).json({
            suceess: true,
            message: "Users fetched",
            user,
        });

    } catch (error) {
        res.status(500).json({
            suceess: false,
            message: "Interval server error",
        });
    }

}

export { register, login, getUsers, getUser };