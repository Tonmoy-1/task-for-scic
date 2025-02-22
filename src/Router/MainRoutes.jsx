import { BrowserRouter, Routes, Route } from "react-router";
import App from "../App";
import Home from "../Pages/Home";
import LoginForm from "../Pages/Login";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}
