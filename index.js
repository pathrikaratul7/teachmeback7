const express = require("express");
const cors = require("cors");

const { scoreExplanation } = require("./scoring.js");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary posts storage
let posts = [];

// Home route
app.get("/", (req, res) => {
    res.send("TeachWall Backend is running!");
});

// Get all posts
app.get("/api/posts", (req, res) => {
    res.json(posts);
});

// Create a new post
app.post("/api/posts", (req, res) => {
    const { title, description, subject, author } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description are required"
        });
    }

    const newPost = {
        id: posts.length + 1,
        title,
        description,
        subject: subject || "General",
        author: author || "Anonymous"
    };

    posts.push(newPost);

    res.status(201).json({
        message: "Post created successfully",
        post: newPost
    });
});

// Teach Me Back scoring
app.post("/api/teachback", (req, res) => {

    const { topic, text } = req.body;

    if (!topic || !text) {
        return res.status(400).json({
            message: "Topic and explanation are required"
        });
    }

    const result = scoreExplanation(topic, text);

    res.json(result);
});


    
// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});