import express from "express";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

const app = express();
app.use(express.json());

const FILE_PATH = "./db.json";

const readBlogs = async () => {
    try {
        if (!existsSync(FILE_PATH)) {
            await writeFile(FILE_PATH, JSON.stringify([], null, 2));
            return [];
        }
        const data = await readFile(FILE_PATH, "utf-8");
        if (!data.trim()) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading blogs:", error);
        return [];
    }
};

const writeBlogs = async (blogs) => {
    await writeFile(FILE_PATH, JSON.stringify(blogs, null, 2));
};

app.get("/blogs", async (req, res) => {
    const blogs = await readBlogs();
    if (blogs.length === 0) return res.status(404).send("No blogs found");
    res.json(blogs);
});

app.get("/blogs/:id", async (req, res) => {
    const id = +req.params.id;
    const blogs = await readBlogs();
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return res.status(404).send(`Blog with id ${id} not found`);
    res.json(blog);
});

app.post("/blogs", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content)
        return res.status(400).json({ error: "Title and content are required" });

    const blogs = await readBlogs();
    const newBlog = { id: Date.now(), title, content };
    blogs.push(newBlog);
    await writeBlogs(blogs);

    res.status(201).json(newBlog);
});

app.put("/blogs/:id", async (req, res) => {
    const id = +req.params.id;
    const { title, content } = req.body;
    if (!title || !content)
        return res.status(400).json({ error: "Title and content are required" });

    const blogs = await readBlogs();
    const existing = blogs.find((b) => b.id === id);
    if (!existing) return res.status(404).send(`No blog found with id ${id}`);

    const updatedBlog = { ...existing, title, content };
    const updatedList = blogs.map((b) => (b.id === id ? updatedBlog : b));
    await writeBlogs(updatedList);

    res.json(updatedBlog);
});

app.delete("/blogs/:id", async (req, res) => {
    const id = +req.params.id;
    const blogs = await readBlogs();

    const exists = blogs.some((b) => b.id === id);
    if (!exists) return res.status(404).send(`No blog found with id ${id}`);

    const newList = blogs.filter((b) => b.id !== id);
    await writeBlogs(newList);

    res.json({ message: `Blog with id ${id} deleted` });
});

app.get("/", (req, res) => res.send("Blog API running"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
