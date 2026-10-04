import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";

import App from "./App.jsx";
import "./index.css";

const theme = {
  token: {
    colorPrimary: "#1E2832",
    colorLink: "#1E2832",
    colorText: "#1E2832",
    borderRadius: 8,
  },
  // components: {
  //   Rate: {
  //     colorFillContent: "#F5C842",
  //     colorTextDisabled: "#E2E8F0",
  //     colorFillContentHover: "#F5C842",
  //   },
  // },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </StrictMode>
);