const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected!");
        return client.db("backend_assignment");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

module.exports = { connectDB };
