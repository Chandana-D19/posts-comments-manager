const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/load", async (req, res) => {
    try {
        const db = req.app.locals.db;

        const users = (await axios.get("https://jsonplaceholder.typicode.com/users")).data;
        const posts = (await axios.get("https://jsonplaceholder.typicode.com/posts")).data;
        const comments = (await axios.get("https://jsonplaceholder.typicode.com/comments")).data;

        await db.collection("users").insertMany(users, { ordered: false });
        await db.collection("posts").insertMany(posts, { ordered: false });
        await db.collection("comments").insertMany(comments, { ordered: false });

        res.status(200).json({ message: "Users, Posts & Comments Loaded Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error loading data", details: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const users = await db.collection("users").find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = parseInt(req.params.userId);
        const user = await db.collection("users").findOne({ id: userId });

        if (!user) return res.status(404).json({ error: "User not found" });

        const userPosts = await db.collection("posts").find({ userId }).toArray();
        for (let post of userPosts) {
            post.comments = await db.collection("comments").find({ postId: post.id }).toArray();
        }

        res.json({ ...user, posts: userPosts });
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
});

router.put("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id, name, username, email, phone } = req.body;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        const existingUser = await db.collection("users").findOne({ id });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const newUser = { id, name, username, email, phone };
        await db.collection("users").insertOne(newUser);

        res.setHeader("Link", `/users/${id}`);
        res.status(201).json({ message: "User added successfully!", userId: id });
    } catch (error) {
        res.status(500).json({ error: "Error adding user" });
    }
});

router.delete("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        await db.collection("users").deleteMany({});
        res.json({ message: "All users deleted!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting users" });
    }
});

router.delete("/:userId", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = parseInt(req.params.userId);

        const result = await db.collection("users").deleteOne({ id: userId });
        if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
});

module.exports = router;
