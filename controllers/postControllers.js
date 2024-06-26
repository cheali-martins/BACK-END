import Post from "../models/post.model.js";

const newPost = async (req, res) => {
    try {
        const { category, title, content, image } = req.body;

        const userdetails = req.user;

        if (!category || !title || !content || !image) {
            res.status(400).json({
                success: false,
                message: "All required fields needed",
            });
            return;
        }

        const post = await Post.create({
            author_name: userdetails?.name,
            author_id: userdetails?._id,
            author_image: userdetails?.image,
            category,
            title,
            content,
            image,
        });

        if (post) {
            res.status(201).json({
                success: true,
                message: "Post Added",
                post,
            });
            return;
        } else {
            res.status(400).json({
                success: true,
                message: "Post not added",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const users = await Post.find({}).exec();

        res.status(200).json({
            suceess: true,
            message: "Posts fetched",
            users,
        });

    } catch (error) {
        res.status(500).json({
            suceess: false,
            message: "Internal server error",
        });
    }
}

const getPost = async (req, res) => {
    try {
        const { id } = req.params

        const user = await Post.findById(id).exec();
        if (!user) {
            return res.status(404).json({
                suceess: false,
                message: "No Post",
            });
        }

        res.status(200).json({
            suceess: true,
            message: "Post fetched",
            user,
        });

    } catch (error) {
        res.status(500).json({
            suceess: false,
            message: "Internal server error",
        });
    }

}

// update post
const updatePost = async (req, res) => {
    try {
        const authUser = req.user;
        console.log("Is user admmin? ", authUser);

        const { id } = req.params;
        const body = req.body;

        console.log("The post ID = ", id);
        // finding if the post exists
        const postExist = await Post.findById(id).exec();
        if (!postExist) {
            res.status(404).json({
                suceess: false,
                message: "Post doesn't exist",
            });
            return;

        }
        console.log("The existing post ==", postExist);

        // checking if user is authorized
        const check = postExist.author_id === authUser._id.toHexString() && authUser.isAdmin;
        console.log("The check =>", check);
        if (!check) {
            res.status(403).json({
                suceess: false,
                message: "Access Denied!",
            });
            return;
        }

        // when u are sending sth u send through the body (req.body)

        const updatedPost = await Post.findByIdAndUpdate(postExist._id, body, { new: true }).exec();

        if (!updatedPost) {

            res.status(40).json({
                suceess: false,
                message: "Error details",
            });
            return;
        }

        res.status(200).json({
            sucess: true,
            message: "Posted Upadated Successfully!",
            updatedPost,
        });

        console.log("The updated post = ", updatedPost);

    } catch (error) {
        res.status(500).json({
            suceess: false,
            message: "Internal server error",
        });
    }
}

export { newPost, getPosts, getPost, updatePost };