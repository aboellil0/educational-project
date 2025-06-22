import express from "express";
import { Client } from "pg";

const connection = new Client({
    host: "localhost",
    user: "postgres",
    password: "176203",
    port: 5432,
    database: "IslamicEducation ",
});


connection.connect()
    .then(() => { console.log("Connected to the database"); })
    .catch((err) => {
        console.error("Connection error", err.stack);
    });


const app = express();
app.use(express.json());
