import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรกคือ Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* หน้าสมัครสมาชิก */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* หน้า Dashboard (เข้าได้เฉพาะคนมี Token) */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;