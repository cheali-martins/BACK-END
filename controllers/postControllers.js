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

export { newPost, getPosts, getPost };