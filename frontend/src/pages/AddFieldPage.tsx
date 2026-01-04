import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddFieldPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ กำหนด URL หลักของ Backend ไว้ที่เดียว
  const API_BASE_URL = "http://localhost:3000";

  // ✅ ฟังก์ชันเปิดคลังภาพเพื่อให้เลือกรูป
  const handleOpenPicker = async () => {
    try {
      // แสดงสถานะกำลังโหลด
      Swal.fire({
        title: 'กำลังดึงคลังภาพ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      const res = await axios.get(`${API_BASE_URL}/media/all`);
      const images = res.data;

      if (images.length === 0) {
        return Swal.fire({
          title: "คลังภาพว่างเปล่า",
          text: "กรุณาไปอัปโหลดรูปภาพที่หน้า Gallery ก่อนครับ",
          icon: "info",
          confirmButtonColor: "#0B2E5E",
          customClass: { popup: 'rounded-[2rem]' }
        });
      }

      // ปิด Loading และแสดง Pop-up ตารางรูปภาพ
      Swal.fire({
        title: 'เลือกรูปสนามจากคลัง',
        html: `
          <div id="image-picker-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-height: 400px; overflow-y: auto; padding: 10px;">
            ${images.map((img: any) => `
              <div onclick="window.confirmSelect('${img.url}')" style="cursor: pointer; border-radius: 20px; overflow: hidden; height: 120px; border: 3px solid #f0f0f0; transition: 0.3s;" onmouseover="this.style.borderColor='#4DA3FF'" onmouseout="this.style.borderColor='#f0f0f0'">
                <img src="${API_BASE_URL}${img.url}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            `).join('')}
          </div>
        `,
        showConfirmButton: false,
        customClass: { popup: 'rounded-[3rem] w-[700px] font-["Noto_Sans_Thai_Looped"]' }
      });

      (window as any).confirmSelect = (url: string) => {
        setSelectedImg(url);
        Swal.close();
      };
    } catch (err) {
      Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลรูปภาพได้", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("เซสชั่นหมดอายุ", "กรุณาเข้าสู่ระบบใหม่อีกครั้ง", "error");
      navigate("/login");
      return;
    }

    try {
      Swal.fire({
        title: 'กำลังบันทึกข้อมูล...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      // ✅ ส่งข้อมูลสนามพร้อม imageUrl ไปยัง Backend
      await axios.post(`${API_BASE_URL}/sport-fields`, 
        { name, type, description, imageUrl: selectedImg }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        title: 'เพิ่มสนามสำเร็จ! ✅',
        text: 'ข้อมูลสนามและรูปภาพถูกบันทึกเรียบร้อยแล้ว',
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
        title: 'เกิดข้อผิดพลาด ❌',
        text: err.response?.data?.message || 'ไม่สามารถเพิ่มสนามได้ (ตรวจสอบสิทธิ์ Admin)',
        icon: 'error',
        confirmButtonColor: '#0B2E5E',
        customClass: { popup: 'rounded-[2rem] font-["Noto_Sans_Thai_Looped"]' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 flex items-center justify-center p-6 antialiased">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4DA3FF]/10 blur-[100px]"></div>
      </div>

      <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-xl border border-white relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-[#4DA3FF] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Admin Management</span>
          <h2 className="text-3xl font-black text-[#0B2E5E] tracking-tight">เพิ่มสนามกีฬาใหม่</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ ส่วนเลือกรูปภาพพร้อม Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">รูปภาพสนาม</label>
            <div 
              onClick={handleOpenPicker}
              className="w-full h-48 bg-[#F4F7FA] rounded-[1.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-[#4DA3FF] transition-all group shadow-inner"
            >
              {selectedImg ? (
                <img src={`${API_BASE_URL}${selectedImg}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Field Preview" />
              ) : (
                <div className="text-center">
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform block">🖼️</span>
                  <p className="text-slate-400 font-bold text-sm">กดเพื่อเลือกรูปจากคลังภาพ</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">ชื่อสนาม</label>
            <input 
              type="text" 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all font-bold text-[#0B2E5E]"
              placeholder="ระบุชื่อสนาม..."
              value={name} onChange={(e) => setName(e.target.value)} required 
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">ประเภทกีฬา</label>
            <input 
              type="text" 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all font-bold text-[#0B2E5E]"
              placeholder="เช่น ฟุตบอล, แบดมินตัน"
              value={type} onChange={(e) => setType(e.target.value)} required 
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">รายละเอียดเพิ่มเติม</label>
            <textarea 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all h-32 font-medium text-[#0B2E5E] resize-none"
              placeholder="ข้อมูลสิ่งอำนวยความสะดวก..."
              value={description} onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button type="submit" className="flex-[2] bg-[#0B2E5E] text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-[#1a3a6b] shadow-xl transition-all active:scale-95 order-1 sm:order-2 shadow-[#0B2E5E]/20">
              บันทึกข้อมูลสนาม
            </button>
            <button type="button" onClick={() => navigate("/fields")} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-200 transition-all active:scale-95 order-2 sm:order-1">
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}