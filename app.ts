import axios from "axios";
import { WebSocketServer } from 'ws';
import dotenv from "dotenv";

dotenv.config();
// import { networkInterfaces } from "os";

// const nets = networkInterfaces();
// const results = Object.create(null); // Or just '{}', an empty object

// for (const name of Object.keys(nets)) {
//   for (const net of nets[name]!) {
//     // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
//     // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
//     const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
//     if (net.family === familyV4Value && !net.internal) {
//       if (!results[name]) {
//         results[name] = [];
//       }
//       results[name].push(net.address);
//     }
//   }
// }

// console.log(results);

const port = parseInt(process.env.PORT!) || 8080;
const wss = new WebSocketServer({ port, path: "/" });

wss.on('connection', function connection(ws) {
  console.log("Connected");
  ws.on('error', console.error);

  ws.on('message', async function message(url) {
    try {
      const { data } = await axios.get(url.toString());

      console.log(data);

      ws.send(data);
    } catch (error) {
      console.error(error);
      ws.send("An error occurred");
    }
  });
});