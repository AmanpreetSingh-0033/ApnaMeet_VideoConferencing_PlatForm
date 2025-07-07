import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};
let usernames = {}; // Stores username by socket.id per room

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("SOMETHING CONNECTED");

    socket.on("join-call", ({ path, username }) => {
      if (!connections[path]) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      if (!usernames[path]) {
        usernames[path] = {};
      }
      usernames[path][socket.id] = username;

      timeOnline[socket.id] = new Date();

      // Notify existing users
      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path],
          usernames[path]
        );
      }

      if (messages[path]) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg["socket-id-sender"]
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      console.log("i am username--------------");
      console.log(usernames);

      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }

          return [room, isFound];
        },
        ["", false]
      );

      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("message", matchingRoom, ":", sender, data);

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      const disconnectedTime = new Date();

      delete timeOnline[socket.id];

      for (const [roomId, socketList] of Object.entries(connections)) {
        const index = socketList.indexOf(socket.id);
        if (index !== -1) {
          socketList.splice(index, 1);

          // Notify remaining users in the room
          socketList.forEach((socketInRoom) => {
            io.to(socketInRoom).emit("user-left", socket.id);
          });

          if (usernames[roomId]) {
            delete usernames[roomId][socket.id];
            if (Object.keys(usernames[roomId]).length === 0) {
              delete usernames[roomId];
            }
          }

          console.log("some disconnected");

          // If no one left in the room, delete the room data
          if (socketList.length === 0) {
            delete connections[roomId];
            delete messages[roomId];

            console.log(`Room ${roomId} deleted because it's empty.`);
          }
          break;
        }
      }
    });
  });

  return io;
};
