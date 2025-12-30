import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ เพิ่มสถานะโหลด
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // เริ่มโหลด
    
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      // ✅ ล้าง Token เก่า (ถ้ามี) และเก็บอันใหม่
      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.access_token);
      
      alert("ล็อกอินสำเร็จ! 🎉");

      // 🚀 🚀 เปลี่ยนจุดหมายไปที่หน้ารวมสนาม (Field List) 🚀 🚀
      navigate("/fields"); 

    } catch (error: any) {
      const message = error.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      alert(`${message} ❌`);
    } finally {
      setLoading(false); // จบการโหลด
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">ยินดีต้อนรับกลับมา</h2>
          <p className="text-gray-500 mt-2">กรุณาเข้าสู่ระบบเพื่อเริ่มจองสนาม</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="กรอกชื่อผู้ใช้งาน..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {loading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 font-medium">
            ยังไม่มีบัญชีสมาชิก? <Link to="/register" className="text-blue-600 hover:underline">สร้างบัญชีใหม่</Link>
        </p>
      </div>
    </div>
  );
}