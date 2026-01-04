import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import Swal เข้ามา

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      // เก็บ Token
      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.access_token);
      
      // ✅ แสดงการแจ้งเตือนสำเร็จแบบนุ่มนวล
      await Swal.fire({
        icon: 'success',
        title: 'ยินดีต้อนรับกลับมา! ✅',
        text: 'เข้าสู่ระบบสำเร็จ กำลังพาคุณไปหน้ารายการสนาม',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-[2.5rem] font-["Noto_Sans_Thai_Looped"]',
        }
      });

      navigate("/fields"); 

    } catch (error: any) {
      const message = error.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      
      // ✅ แจ้งเตือน Error ด้วย Swal
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ ❌',
        text: message,
        confirmButtonColor: '#0B2E5E',
        customClass: {
          popup: 'rounded-[2rem] font-["Noto_Sans_Thai_Looped"]',
          confirmButton: 'rounded-2xl px-10'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 antialiased p-6">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4DA3FF]/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0B2E5E]/5 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white relative z-10 transition-all">
        
        {/* LOGO / HEADER */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-[#F0F5FA] rounded-[1.5rem] mb-6">
            <h1 className="text-3xl font-black tracking-tight text-[#0B2E5E]">
              จอง<span className="text-[#4DA3FF]">สนาม</span>
            </h1>
          </div>
          <h2 className="text-2xl font-black text-[#0B2E5E] leading-tight">ยินดีต้อนรับ</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">เข้าสู่ระบบเพื่อจัดการการจองของคุณ</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div className="group">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#4DA3FF]">ชื่อผู้ใช้งาน</label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-6 py-4 bg-[#F4F7FA] border-2 border-transparent rounded-[1.2rem] focus:outline-none focus:border-[#4DA3FF] focus:bg-white transition-all font-bold text-[#0B2E5E]"
                placeholder="กรอกชื่อผู้ใช้งาน..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">👤</span>
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#4DA3FF]">รหัสผ่าน</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-6 py-4 bg-[#F4F7FA] border-2 border-transparent rounded-[1.2rem] focus:outline-none focus:border-[#4DA3FF] focus:bg-white transition-all font-bold text-[#0B2E5E]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔒</span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[1.5rem] font-black text-lg text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              loading 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-[#0B2E5E] hover:bg-[#1a3a6b] shadow-[#0B2E5E]/20"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>กำลังโหลด...</span>
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-10">
            <p className="text-slate-400 font-bold text-sm">
                ยังไม่มีบัญชีสมาชิก? 
                <Link to="/register" className="text-[#4DA3FF] hover:text-[#0B2E5E] ml-2 transition-colors underline-offset-4 hover:underline">
                    สร้างบัญชีใหม่
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}