import { StrictMode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import store from "./store";
import "./styles/globals.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>
);
