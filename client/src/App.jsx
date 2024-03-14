import { useState } from "react";
import CodeMirror from "codemirror";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className=" bg-black">
      <Toaster position="top-right"></Toaster>
      <Routes>
        <Route index={true} path="/" element={<HomePage></HomePage>}></Route>
        <Route
          path="/editor/:roomid"
          element={<EditorPage></EditorPage>}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
