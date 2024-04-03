import express from "express";
import { _readGoogleSheet, _writeGoogleSheet, _clearGoogleSheet } from "./google-sheet";

const app = express();

app.use(express.json());

app.get("/take-attendance", async function (req, res) {
    const { id: studentId } = req.query as { id: string };

    try {
        const now = new Date();
        const dateTimeString = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
        await _writeGoogleSheet("A2:B", [[dateTimeString, studentId]]);

        res.send("Attendance taken");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

app.get("/clear-attendance", async function (req, res) {
    try {
        await _clearGoogleSheet("A2:B");

        res.send("Attendance cleared");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});