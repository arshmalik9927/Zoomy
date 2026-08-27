import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};
let userNames = {};

const connectToSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        // JOIN CALL
        socket.on("join-call", (path, username) => {

            if (connections[path] === undefined) {
                connections[path] = [];
            }

            connections[path].push(socket.id);

            // Store username
            userNames[socket.id] = username || "Guest";

            timeOnline[socket.id] = new Date();

            connections[path].forEach((socketId) => {

                io.to(socketId).emit(
                    "user-joined",
                    socket.id,
                    connections[path],
                    userNames
                );

            });

            // Previous messages
            if (messages[path] !== undefined) {

                messages[path].forEach((message) => {

                    io.to(socket.id).emit(
                        "chat-message",
                        message.data,
                        message.sender,
                        message.socketIdSender
                    );

                });

            }

        });


        // WEBRTC SIGNAL
        socket.on("signal", (toId, message) => {

            io.to(toId).emit(
                "signal",
                socket.id,
                message
            );

        });


        // CHAT MESSAGE
        socket.on("chat-message", (data, sender) => {

            // Find room of current socket
            const [matchingRoom, found] =
                Object.entries(connections).reduce(
                    ([room, isFound], [roomKey, roomValue]) => {

                        if (!isFound && roomValue.includes(socket.id)) {
                            return [roomKey, true];
                        }

                        return [room, isFound];

                    },
                    ["", false]
                );


            if (found) {

                // Create message array
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                // Save message
                messages[matchingRoom].push({
                    sender: sender,
                    data: data,
                    socketIdSender: socket.id
                });

                console.log(
                    "Message:",
                    matchingRoom,
                    sender,
                    data
                );

                // Send message to everyone in room
                connections[matchingRoom].forEach((socketId) => {

                    io.to(socketId).emit(
                        "chat-message",
                        data,
                        sender,
                        socket.id
                    );

                });

            }

        });


        // DISCONNECT
        socket.on("disconnect", () => {

            console.log("User disconnected:", socket.id);

            const disconnectTime = new Date();

            const startTime = timeOnline[socket.id];

            if (startTime) {

                const diffTime =
                    Math.abs(disconnectTime - startTime);

                console.log(
                    "User online time:",
                    diffTime / 1000,
                    "seconds"
                );

            }


            // Find user's room
            for (const [roomKey, roomValue] of Object.entries(connections)) {

                if (roomValue.includes(socket.id)) {

                    // Notify other users
                    connections[roomKey].forEach((socketId) => {

                        if (socketId !== socket.id) {

                            io.to(socketId).emit(
                                "user-left",
                                socket.id
                            );

                        }

                    });


                    // Remove user
                    const index =
                        connections[roomKey].indexOf(socket.id);

                    if (index !== -1) {
                        connections[roomKey].splice(index, 1);
                    }


                    // Delete empty room
                    if (connections[roomKey].length === 0) {
                        delete connections[roomKey];
                    }

                }

            }


            // Remove online time
            delete timeOnline[socket.id];

        });

    });

    return io;
};

export default connectToSocket;