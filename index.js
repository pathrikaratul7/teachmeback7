const express = require("express");
const cors = require("cors");

//const { scoreExplanation } = require("./scoring.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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
// /app.post("/api/teachback", (req, res) => {

//     const { topic, text } = req.body;

//     if (!topic || !text) {
//         return res.status(400).json({
//             message: "Topic and explanation are required"
//         });
//     }

//     const result = scoreExplanation(topic, text);

//     res.json(result);
// });

// Proxy explanation checks through the backend to avoid browser CORS errors.
app.post("/api/chat", async (req, res) => {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            message: "A non-empty message is required"
        });
    }

    try {
        const response = await fetch("https://thekartik7.runasp.net/api/Chat", {
            method: "POST",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `${message}\nvalidate this answer and also give scoring out of 10 and rating out of 5`
            })
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Chat API proxy error:", error);
        res.status(502).json({ message: "Unable to reach the explanation service." });
    }
});


    
// // Start server
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// Start server // MonsterASP provides the PORT through web.config
 const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () =>
     { 
        console.log(`TeachWall Backend is running on port ${PORT}`);
    
    });