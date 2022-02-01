import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import connectDB from "./config/db.js";

import {
  getDocument,
  updateDocument,
} from "./controller/document.controller.js";

connectDB();

const PORT = process.env.PORT || 4000;

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "HEAD", "OPTIONS", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("getDocument", async (docid) => {
    const document = await getDocument(docid);

    socket.join(docid);

    socket.emit("loadDocument", document.content);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(docid).emit("reciveChanges", delta);
    });

    socket.on("saveDocument", async (data) => {
      await updateDocument(docid, data);
    });
  });
});
