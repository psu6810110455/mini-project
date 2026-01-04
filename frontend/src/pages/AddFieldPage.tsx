import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ นำเข้า SweetAlert2

export default function AddFieldPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
      
      await axios.post("http://localhost:3000/sport-fields", 
        { name, type, description }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ แก้ไข: ใช้ SweetAlert2 แทน alert แบบเดิม
      // ตัด borderRadius ออกเพื่อแก้ TypeScript Error และใช้ customClass แทน
      await Swal.fire({
        title: 'เพิ่มสนามสำเร็จ! ✅',
        text: 'ข้อมูลสนามถูกบันทึกลงในระบบเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonColor: '#0B2E5E',
        confirmButtonText: 'ตกลง',
        customClass: {
          popup: 'rounded-[2.5rem] font-["Noto_Sans_Thai_Looped"]', // กำหนดความโค้งมนที่นี่
          confirmButton: 'rounded-2xl px-10 py-3 font-bold shadow-lg shadow-[#0B2E5E]/20'
        }
      });

      navigate("/fields");
    } catch (err: any) {
      console.error("Error adding field:", err);
      
      // ✅ แจ้งเตือนกรณี Error ด้วย SweetAlert2
      Swal.fire({
        title: 'เกิดข้อผิดพลาด ❌',
        text: err.response?.data?.message || 'ไม่สามารถเพิ่มสนามได้ กรุณาลองใหม่',
        icon: 'error',
        confirmButtonColor: '#0B2E5E',
        customClass: {
          popup: 'rounded-[2rem] font-["Noto_Sans_Thai_Looped"]'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 flex items-center justify-center p-6 antialiased">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4DA3FF]/10 blur-[100px]"></div>
      </div>

      <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-xl border border-white relative z-10 transition-all">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-[#4DA3FF] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Admin Management</span>
          <h2 className="text-3xl font-black text-[#0B2E5E] tracking-tight">เพิ่มสนามกีฬาใหม่</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">ระบุข้อมูลรายละเอียดสนามให้ครบถ้วน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ชื่อสนาม */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">ชื่อสนาม</label>
            <input 
              type="text" 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all font-bold text-[#0B2E5E]"
              placeholder="เช่น สนามฟุตบอลหญ้าเทียม A"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          {/* ประเภทสนาม */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">ประเภทกีฬา</label>
            <input 
              type="text" 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all font-bold text-[#0B2E5E]"
              placeholder="เช่น ฟุตบอล, แบดมินตัน"
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              required 
            />
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">รายละเอียดเพิ่มเติม</label>
            <textarea 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all h-32 font-medium text-[#0B2E5E] resize-none"
              placeholder="ระบุสิ่งอำนวยความสะดวก หรือ กฎระเบียบ..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          {/* ปุ่มกด */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              className="flex-[2] bg-[#0B2E5E] text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-[#1a3a6b] shadow-xl shadow-[#0B2E5E]/20 transition-all active:scale-95 order-1 sm:order-2"
            >
              บันทึกข้อมูลสนาม
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/fields")} 
              className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-200 transition-all active:scale-95 order-2 sm:order-1"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}