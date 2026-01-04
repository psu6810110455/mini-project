import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ นำเข้า SweetAlert2

export default function EditFieldPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchField = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/sport-fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(res.data.name);
        setType(res.data.type);
        setDescription(res.data.description);
      } catch (err) {
        console.error("ดึงข้อมูลไม่สำเร็จ");
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลสนามได้',
          confirmButtonColor: '#0B2E5E',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchField();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/sport-fields/${id}`, 
        { name, type, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ เปลี่ยน alert เป็น Swal.fire ดีไซน์พรีเมียม
      await Swal.fire({
        title: 'แก้ไขข้อมูลสำเร็จ! ✅',
        text: 'ข้อมูลสนามได้รับการอัปเดตเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonColor: '#0B2E5E',
        confirmButtonText: 'ตกลง',
        customClass: {
          popup: 'rounded-[2.5rem] font-["Noto_Sans_Thai_Looped"]',
          confirmButton: 'rounded-2xl px-10 py-3 font-bold shadow-lg shadow-[#0B2E5E]/20'
        }
      });
      
      navigate("/fields");
    } catch (err: any) {
      Swal.fire({
        title: 'แก้ไขไม่สำเร็จ ❌',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        icon: 'error',
        confirmButtonColor: '#0B2E5E',
        customClass: {
          popup: 'rounded-[2rem]'
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E9F1F7] flex items-center justify-center font-['Noto_Sans_Thai_Looped']">
        <p className="font-bold text-[#0B2E5E] animate-pulse">กำลังดึงข้อมูลเดิม...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 flex items-center justify-center p-6 antialiased">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-[#0B2E5E]/5 blur-[80px]"></div>
      </div>

      <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-xl border border-white relative z-10 transition-all">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-[#4DA3FF] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Editor Mode</span>
          <h2 className="text-3xl font-black text-[#0B2E5E] tracking-tight">แก้ไขข้อมูลสนาม</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">ปรับปรุงข้อมูลสนามให้เป็นปัจจุบัน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ชื่อสนาม */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">ชื่อสนาม</label>
            <input 
              type="text" 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all font-bold text-[#0B2E5E]"
              placeholder="ระบุชื่อสนาม..."
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          {/* ประเภท */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">ประเภทสนามกีฬา</label>
            <input 
              type="text" 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all font-bold text-[#0B2E5E]"
              placeholder="เช่น ฟุตบอล, บาสเกตบอล"
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              required 
            />
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">รายละเอียดสนาม</label>
            <textarea 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all h-32 font-medium text-[#0B2E5E] resize-none"
              placeholder="ข้อมูลสิ่งอำนวยความสะดวก..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          {/* ปุ่มดำเนินการ */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              className="flex-[2] bg-[#0B2E5E] text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-[#1a3a6b] shadow-xl shadow-[#0B2E5E]/20 transition-all active:scale-95 order-1 sm:order-2"
            >
              บันทึกการแก้ไข
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/fields")} 
              className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-200 transition-all active:scale-95 order-2 sm:order-1"
            >
              กลับ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}