import React, { Fragment, useEffect, useState } from "react";
import { Box } from "@mui/material";
import Quill from "quill";
import styled from "@emotion/styled";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import "quill/dist/quill.snow.css";
import "./editor.css";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Component = styled.div`
  background: #f5f5f5;
`;

export default function Editor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id } = useParams();

  useEffect(() => {
    const quilServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quilServer.disable();
    quilServer.setText("Please wait Loading document....");
    setQuill(quilServer);
  }, []);

  useEffect(() => {
    const socketServer = io("http://localhost:4000");
    setSocket(socketServer);

    socketServer.on("disconnect", function () {
      //Your Code Here
      toast.error("connection disconnect");
    });

    // Component will unmount
    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const hanedelChanges = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket && socket.emit("send-changes", delta);
    };

    quill && quill.on("text-change", hanedelChanges);

    return () => {
      quill && quill.off("text-change", hanedelChanges);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;

    socket &&
      socket.once("loadDocument", (document) => {
        quill && quill.setContents(document);
        quill && quill.enable();
      });

    socket && socket.emit("getDocument", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (!socket || !quill) return;

    const hanedelChanges = (delta) => {
      quill && quill.updateContents(delta);
    };

    socket && socket.on("reciveChanges", hanedelChanges);

    return () => {
      socket && socket.off("reciveChanges", hanedelChanges);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket && socket.emit("saveDocument", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return (
    <Fragment>
      <Component>
        <Box className="container" id="container"></Box>
      </Component>
    </Fragment>
  );
}
