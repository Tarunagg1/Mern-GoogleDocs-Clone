import { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import Editor from "./components/Editor";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

function App() {
  return (
    <Fragment>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to={`/docs/${uuid()}`} />} />
        <Route path="/docs/:id" element={<Editor />} />
      </Routes>
    </Fragment>
  );
}

export default App;
