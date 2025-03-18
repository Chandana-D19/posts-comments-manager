 
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const posts = await db.collection("posts").find().toArray();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Error fetching posts" });
    }
});


router.get("/:postId", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const postId = parseInt(req.params.postId);
        const post = await db.collection("posts").findOne({ id: postId });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Error fetching post" });
    }
});


router.delete("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        await db.collection("posts").deleteMany({});
        res.status(200).json({ message: "All posts deleted!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting posts" });
    }
});

router.delete("/:postId", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const postId = parseInt(req.params.postId);
        const result = await db.collection("posts").deleteOne({ id: postId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting post" });
    }
});

module.exports = router;
