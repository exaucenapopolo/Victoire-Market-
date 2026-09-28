import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/global.css";

const el = document.getElementById("root");
if (!el) throw new Error("Élément #root manquant dans index.html");

ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
