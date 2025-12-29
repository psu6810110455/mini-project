import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      alert("ล็อกอินสำเร็จ! 🎉");
      // ✅ เก็บ Token ลงเครื่อง (LocalStorage)
      localStorage.setItem("token", response.data.access_token);
      
      // 🚀 ไปหน้า Dashboard ทันที
      navigate("/dashboard");

    } catch (error) {
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ❌");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">เข้าสู่ระบบ</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">ชื่อผู้ใช้งาน (Username)</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ล็อกอิน
          </button>
        </form>

        {/* 👇 ลิงก์ไปหน้า Register */}
        <p className="text-center mt-4 text-gray-600">
            ยังไม่มีบัญชี? <Link to="/register" className="text-blue-500 hover:underline">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
}