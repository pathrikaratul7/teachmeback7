const express = require("express");
const cors = require("cors");

//const { scoreExplanation } = require("./scoring.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Home route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Proxy the posts list through the backend to avoid browser CORS errors.
app.get("/api/posts", async (req, res) => {
    try {
        const response = await fetch("https://thekartik7.runasp.net/api/posts", {
            method: "GET",
            headers: { "accept": "text/plain" }
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Posts lookup proxy error:", error);
        res.status(502).json({ message: "Unable to load posts." });
    }
});

// Proxy a single post lookup through the backend to avoid browser CORS errors.
app.get("/api/posts/:postId", async (req, res) => {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId < 0) {
        return res.status(400).json({ message: "A valid postId is required" });
    }

    try {
        const response = await fetch(`https://thekartik7.runasp.net/api/posts/${postId}`, {
            method: "GET",
            headers: { "accept": "text/plain" }
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Single post lookup proxy error:", error);
        res.status(502).json({ message: "Unable to load the post." });
    }
});

// Proxy post creation through the backend to avoid browser CORS errors.
app.post("/api/posts", async (req, res) => {
    const { title, description, subject, author } = req.body || {};

    if (!title || !description || !subject || !author) {
        return res.status(400).json({
            message: "Title, description, subject, and author are required"
        });
    }

    try {
        const response = await fetch("https://thekartik7.runasp.net/api/posts", {
            method: "POST",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: String(title).trim(),
                description: String(description).trim(),
                subject: String(subject).trim(),
                author: String(author).trim()
            })
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Posts API proxy error:", error);
        res.status(502).json({ message: "Unable to create the post." });
    }
});

// Proxy post deletion through the backend to avoid browser CORS errors.
app.delete("/api/posts/:postId", async (req, res) => {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId < 0) {
        return res.status(400).json({ message: "A valid postId is required" });
    }

    try {
        const response = await fetch(`https://thekartik7.runasp.net/api/posts/${postId}`, {
            method: "DELETE",
            headers: { "accept": "*/*" }
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Post deletion proxy error:", error);
        res.status(502).json({ message: "Unable to delete the post." });
    }
});

// Proxy post upvotes through the backend to avoid browser CORS errors.
app.post("/api/upvotes", async (req, res) => {
    const postId = Number(req.body?.postId);

    if (!Number.isInteger(postId) || postId < 0) {
        return res.status(400).json({ message: "A valid postId is required" });
    }

    try {
        const response = await fetch("https://thekartik7.runasp.net/api/upvotes", {
            method: "POST",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId })
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Post upvote proxy error:", error);
        res.status(502).json({ message: "Unable to upvote the post." });
    }
});

// Proxy answer submissions through the backend to avoid browser CORS errors.
app.post("/api/answers", async (req, res) => {
    const { postId, answer, author } = req.body || {};

    if (postId === undefined || typeof answer !== "string" || !answer.trim() || typeof author !== "string" || !author.trim()) {
        return res.status(400).json({
            message: "postId, answer, and author are required"
        });
    }

    try {
        const response = await fetch("https://thekartik7.runasp.net/api/answers", {
            method: "POST",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: Number(postId),
                answer: answer.trim(),
                author: author.trim()
            })
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Answers API proxy error:", error);
        res.status(502).json({ message: "Unable to submit the answer." });
    }
});

// Proxy answers for a post through the backend to avoid browser CORS errors.
app.get("/api/answers/post/:postId", async (req, res) => {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId < 0) {
        return res.status(400).json({ message: "A valid postId is required" });
    }

    try {
        const response = await fetch(`https://thekartik7.runasp.net/api/answers/post/${postId}`, {
            method: "GET",
            headers: { "accept": "text/plain" }
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Answers lookup proxy error:", error);
        res.status(502).json({ message: "Unable to load answers." });
    }
});

// Proxy a single answer lookup through the backend to avoid browser CORS errors.
app.get("/api/answers/:answerId", async (req, res) => {
    const answerId = Number(req.params.answerId);

    if (!Number.isInteger(answerId) || answerId < 0) {
        return res.status(400).json({ message: "A valid answerId is required" });
    }

    try {
        const response = await fetch(`https://thekartik7.runasp.net/api/answers/${answerId}`, {
            method: "GET",
            headers: { "accept": "text/plain" }
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Single answer lookup proxy error:", error);
        res.status(502).json({ message: "Unable to load the answer." });
    }
});

// Proxy answer deletion through the backend to avoid browser CORS errors.
app.delete("/api/answers/:answerId", async (req, res) => {
    const answerId = Number(req.params.answerId);

    if (!Number.isInteger(answerId) || answerId < 0) {
        return res.status(400).json({ message: "A valid answerId is required" });
    }

    try {
        const response = await fetch(`https://thekartik7.runasp.net/api/answers/${answerId}`, {
            method: "DELETE",
            headers: { "accept": "*/*" }
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("Answer deletion proxy error:", error);
        res.status(502).json({ message: "Unable to delete the answer." });
    }
});

// Proxy Teach Me Back scoring through the backend to avoid browser CORS errors.
app.post("/api/teachback", async (req, res) => {
    const { userId, topic, text } = req.body || {};

    if (!Number.isInteger(Number(userId)) || Number(userId) <= 0 || typeof topic !== "string" || !topic.trim() || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({
            message: "userId, topic, and explanation are required"
        });
    }

    try {
        const response = await fetch("https://thekartik7.runasp.net/api/teachback", {
            method: "POST",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(userId),
                topic: topic.trim(),
                text: text.trim()
            })
        });

        const responseBody = await response.text();
        res.status(response.status).type(response.headers.get("content-type") || "text/plain").send(responseBody);
    } catch (error) {
        console.error("TeachBack API proxy error:", error);
        res.status(502).json({ message: "Unable to score the explanation." });
    }
});

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