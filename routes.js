const { get } = require("https");

function fetchJSON(url, callback) {
    get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { callback(JSON.parse(data)); });
    }).on("error", (err) => {
        console.error("Error fetching JSON:", err);
    });
}

async function handleRequest(req, res, db) {
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/load" && req.method === "GET") {
        try {
            fetchJSON("https://jsonplaceholder.typicode.com/users", async (users) => {
                await db.collection("users").insertMany(users, { ordered: false });
                res.writeHead(200);
                res.end(JSON.stringify({ message: "Users loaded successfully!" }));
            });
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Error loading users" }));
        }
    }

    else if (req.url.startsWith("/users/") && req.method === "GET") {
        const userId = parseInt(req.url.split("/")[2]);
        const user = await db.collection("users").findOne({ id: userId });

        if (!user) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "User not found" }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify(user));
        }
    }

    else if (req.url === "/users" && req.method === "DELETE") {
        await db.collection("users").deleteMany({});
        res.writeHead(200);
        res.end(JSON.stringify({ message: "All users deleted!" }));
    }

    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Endpoint not found" }));
    }
}

module.exports = { handleRequest };
