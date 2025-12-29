import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 📡 ยิงไปที่ Backend เพื่อสร้าง User ใหม่
      await axios.post("http://localhost:3000/users", {
        username,
        password,
        role: "user", // ค่าเริ่มต้นให้เป็น user ธรรมดา
      });

      alert("สมัครสมาชิกสำเร็จ! 🎉 กรุณาล็อกอิน");
      navigate("/"); // ส่งกลับไปหน้า Login

    } catch (error) {
      console.error(error);
      alert("สมัครไม่ผ่าน ❌ (ชื่อนี้อาจมีคนใช้แล้ว)");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">สมัครสมาชิกใหม่</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700">ชื่อผู้ใช้งาน (Username)</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="ตั้งชื่อผู้ใช้..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="ตั้งรหัสผ่าน..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            ลงทะเบียน
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
           มีบัญชีอยู่แล้ว? <Link to="/" className="text-blue-500 hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}