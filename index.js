import { Server } from "socket.io";
const io = new Server(server);
io.listen(3000);