import { Server } from "http";
import app from "./app";

const server = new Server(app);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server is running on " + PORT));
