import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
const PORT = 80;

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));app.use(express.json());

app.get("/:page?", (req, res) => {
    let page = req.params.page || "index"; // Default to index if no page is given
    res.sendFile(path.join(__dirname, "public", `${page}.html`));
});

// Login route
app.post("/login", async (req, res) => {
    const url = "http://216.8.148.154:8090/api/collections/users/auth-with-password";
    const { identity, password } = req.body;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identity, password })
        });

        const data = await response.json();
        if (response.ok) {
            res.json({ success: true, token: data.token });
        } else {
            res.status(401).json({ success: false, error: data.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
