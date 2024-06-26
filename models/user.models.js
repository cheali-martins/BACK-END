import mongoose from "mongoose"

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Input name"],
        },
        image: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            required: [true, "Please input a bio"],
        },
        social: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Input email"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Input password"],
        },
        // ADDING if user is an admin

        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    // this indicates fields to let us know when a user creates a db
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema)

export default User