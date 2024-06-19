import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
    {
        author_id: {
            type: String,
            required: [true, "Please i need the userid"],
        },
        author_name: {
            type: String,
            required: [true, "Please i need the name"],
        },
        author_image: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            required: [true, "Please i need the bio"],
        },
        title: {
            type: String,
            require: [true, "I need the title"],
        },
        content: {
            type: String,
            required: [true, "Please i need the content"],
        },
        image: {
            type: String,
            required: [true, "Please i need the image"],
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;