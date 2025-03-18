 
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const comments = await db.collection("comments").find().toArray();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
});


router.get("/:commentId", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const commentId = parseInt(req.params.commentId);
        const comment = await db.collection("comments").findOne({ id: commentId });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comment" });
    }
});


router.delete("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        await db.collection("comments").deleteMany({});
        res.status(200).json({ message: "All comments deleted!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting comments" });
    }
});

router.delete("/:commentId", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const commentId = parseInt(req.params.commentId);
        const result = await db.collection("comments").deleteOne({ id: commentId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting comment" });
    }
});

module.exports = router;
