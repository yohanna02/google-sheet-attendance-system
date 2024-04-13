import express from "express";
import axios from "axios";
import { networkInterfaces } from "os";

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log(results);

const app = express();

app.use(express.json());

app.get("/google-sheet", async function (req, res) {
    const query = req.query as { url: string, uid: string };

    console.log(query);

    try {
        const { data } = await axios.get(query.url + "&uid=" + query.uid);

        console.log(data);

        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});