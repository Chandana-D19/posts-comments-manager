const { createServer } = require("http");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectDB() {
    await client.connect();
    console.log("MongoDB Connected!");
    return client.db("backend_assignment");
}

async function handleRequest(req, res, db) {
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/load" && req.method === "GET") {
        try {
            const users = [
                { id: 1, name: "Leanne Graham", email: "Sincere@april.biz" },
                { id: 2, name: "Ervin Howell", email: "Shanna@melissa.tv" }
            ];
            await db.collection("users").insertMany(users, { ordered: false });
            res.writeHead(200);
            res.end(JSON.stringify({ message: "Users loaded successfully!" }));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Error loading users" }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Endpoint not found" }));
    }
}

async function startServer() {
    const db = await connectDB();
    const server = createServer((req, res) => handleRequest(req, res, db));

    server.listen(3000, () => console.log("Server running at http://localhost:3000"));
}

startServer();
