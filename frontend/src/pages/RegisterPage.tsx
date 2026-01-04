import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ นำเข้า SweetAlert2

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 📡 ยิงไปที่ Backend เพื่อสร้าง User ใหม่
      await axios.post("http://localhost:3000/users", {
        username,
        password,
        role: "user", // ค่าเริ่มต้นให้เป็น user ธรรมดา
      });

      // ✅ เปลี่ยน alert เป็น Swal.fire ดีไซน์พรีเมียม
      await Swal.fire({
        title: 'สมัครสมาชิกสำเร็จ! 🎉',
        text: 'ยินดีต้อนรับ! กรุณาล็อกอินเพื่อเริ่มจองสนาม',
        icon: 'success',
        confirmButtonColor: '#0B2E5E',
        confirmButtonText: 'ไปหน้าล็อกอิน',
        customClass: {
          popup: 'rounded-[2.5rem] font-["Noto_Sans_Thai_Looped"]',
          confirmButton: 'rounded-2xl px-10 py-3 font-bold shadow-lg shadow-[#0B2E5E]/20'
        }
      });

      navigate("/"); // ส่งกลับไปหน้า Login

    } catch (error: any) {
      console.error(error);
      // ✅ แจ้งเตือนกรณีสมัครไม่ผ่าน
      Swal.fire({
        title: 'สมัครไม่ผ่าน ❌',
        text: error.response?.data?.message || 'ชื่อผู้ใช้นี้อาจมีคนใช้แล้ว หรือระบบขัดข้อง',
        icon: 'error',
        confirmButtonColor: '#0B2E5E',
        customClass: {
          popup: 'rounded-[2rem]'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 antialiased p-6">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4DA3FF]/10 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-[#F0F5FA] rounded-[1.5rem] mb-6">
            <h1 className="text-3xl font-black tracking-tight text-[#0B2E5E]">
              จอง<span className="text-[#4DA3FF]">สนาม</span>
            </h1>
          </div>
          <h2 className="text-2xl font-black text-[#0B2E5E] leading-tight">สมัครสมาชิกใหม่</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">เริ่มต้นค้นหาสนามกีฬาที่ใช่สำหรับคุณ</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">ชื่อผู้ใช้งาน (Username)</label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-6 py-4 bg-[#F4F7FA] border-2 border-transparent rounded-[1.2rem] focus:outline-none focus:border-[#4DA3FF] focus:bg-white transition-all font-bold text-[#0B2E5E]"
                placeholder="ตั้งชื่อผู้ใช้งาน..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 text-xl">👤</span>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">รหัสผ่าน</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-6 py-4 bg-[#F4F7FA] border-2 border-transparent rounded-[1.2rem] focus:outline-none focus:border-[#4DA3FF] focus:bg-white transition-all font-bold text-[#0B2E5E]"
                placeholder="ตั้งรหัสผ่านของคุณ..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 text-xl">🔒</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 rounded-[1.5rem] font-black text-lg text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              isLoading 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-[#0B2E5E] hover:bg-[#1a3a6b] shadow-[#0B2E5E]/20"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>กำลังลงทะเบียน...</span>
              </>
            ) : (
              "ลงทะเบียนสมาชิก"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center mt-8 text-slate-400 font-bold text-sm">
            มีบัญชีสมาชิกอยู่แล้ว? 
            <Link to="/" className="text-[#4DA3FF] hover:text-[#0B2E5E] ml-2 transition-colors underline-offset-4 hover:underline">
                เข้าสู่ระบบที่นี่
            </Link>
        </p>
      </div>
    </div>
  );
}