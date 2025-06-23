import express from "express";
import { Client } from "pg";

const connection = new Client({
    host: "localhost",
    user: "postgres",
    password: "176203",
    port: 5432,
    database: "IslamicEducation",
});

// Connect to database
connection.connect()
    .then(() => { console.log("Connected to the database"); })
    .catch((err) => {
        console.error("Connection error", err.stack);
    });

const app = express();
app.use(express.json());

// Basic error handler
const handleError = (err: Error, res: express.Response) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
};

// Example query endpoint
app.get('/test', async (req, res) => {
    try {
        const result = await connection.query('SELECT NOW()');
        res.json(result.rows);
    } catch (err) {
        handleError(err as Error, res);
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Cleanup on app termination
process.on('SIGTERM', () => {
    connection.end();
    process.exit();
});
