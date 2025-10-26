const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const server = http.createServer(async (req, res) => {
    try {
        if (req.url === "/" || req.url === "/index.html") {

            const html = await fs.readFile(path.join(__dirname, "index.html"));
            res.setHeader("Content-Type", "text/html");
            return res.end(html);
        }

        if (req.url === "/index.js") {

            const js = await fs.readFile(path.join(__dirname, "index.js"));
            res.setHeader("Content-Type", "application/javascript");
            return res.end(js);
        }

        if (req.url === "/style.css") {

            const css = await fs.readFile(path.join(__dirname, "style.css"));
            res.setHeader("Content-Type", "text/css");
            return res.end(css);
        }


        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("404 Not Found");
    } catch (err) {
        console.error("Server error:", err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Server error");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
