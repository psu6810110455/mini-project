// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FieldListPage from "./pages/FieldListPage";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import AddFieldPage from "./pages/AddFieldPage"; // ✅ Import เพิ่ม
import EditFieldPage from "./pages/EditFieldPage"; // ✅ Import เพิ่ม

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔑 ส่วนของการเข้าสู่ระบบและสมัครสมาชิก */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 🏟️ ส่วนของสนาม (User เห็นรายการ / Admin เห็นปุ่มจัดการ) */}
        <Route path="/fields" element={<FieldListPage />} />
        
        {/* ➕ ส่วนของ Admin (จัดการสนาม) */}
        <Route path="/add-field" element={<AddFieldPage />} />
        <Route path="/edit-field/:id" element={<EditFieldPage />} />
        
        {/* 📅 ส่วนของการจอง (ส่ง ID สนามไปด้วย) */}
        <Route path="/booking/:fieldId" element={<BookingPage />} />
        
        {/* 📋 ส่วนของประวัติการจอง (Dashboard) */}
        <Route path="/my-bookings" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* 🏠 หน้าแรกสุด ให้ไปที่ Login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;