import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditFieldPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImg, setSelectedImg] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // URL หลักของ Backend
  const API_BASE_URL = "http://localhost:3000";

  // 1. ดึงข้อมูลสนามเดิมมาแสดงผล
  useEffect(() => {
    const fetchField = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/sport-fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(res.data.name);
        setType(res.data.type);
        setDescription(res.data.description);
        setSelectedImg(res.data.imageUrl); 
      } catch (err: any) {
        console.error("ดึงข้อมูลไม่สำเร็จ", err);
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: err.response?.status === 401 ? 'เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่' : 'ไม่สามารถดึงข้อมูลสนามได้',
          confirmButtonColor: '#0B2E5E',
        });
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchField();
  }, [id, navigate]);

  // 2. ฟังก์ชันเปิดคลังภาพเพื่อให้เลือกรูปใหม่
  const handleOpenPicker = async () => {
    try {
      Swal.fire({
        title: 'กำลังโหลดคลังภาพ...',
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
        });
      }

      Swal.fire({
        title: 'เปลี่ยนรูปสนามจากคลัง',
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

  // 3. บันทึกการแก้ไข
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("ผิดพลาด", "ไม่พบรหัสเข้าใช้งาน กรุณาเข้าสู่ระบบใหม่", "error");
      navigate("/login");
      return;
    }

    try {
      Swal.fire({
        title: 'กำลังบันทึกข้อมูล...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      // ✅ ส่งข้อมูลพร้อม Header Authorization และ imageUrl ใหม่
      await axios.patch(`${API_BASE_URL}/sport-fields/${id}`, 
        { 
          name, 
          type, 
          description,
          imageUrl: selectedImg 
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

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
      console.error("บันทึกไม่สำเร็จ", err);
      Swal.fire({
        title: 'แก้ไขไม่สำเร็จ ❌',
        text: err.response?.status === 401 ? 'คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้ หรือเซสชั่นหมดอายุ' : (err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'),
        icon: 'error',
        confirmButtonColor: '#0B2E5E',
        customClass: { popup: 'rounded-[2rem]' }
      });
      if (err.response?.status === 401) navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E9F1F7] flex items-center justify-center font-['Noto_Sans_Thai_Looped']">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0B2E5E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-[#0B2E5E]">กำลังดึงข้อมูลเดิม...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 flex items-center justify-center p-6 antialiased">
      <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-xl border border-white relative z-10 transition-all">
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-[#4DA3FF] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Editor Mode</span>
          <h2 className="text-3xl font-black text-[#0B2E5E] tracking-tight">แก้ไขข้อมูลสนาม</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">ปรับปรุงข้อมูลสนามให้เป็นปัจจุบัน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">รูปภาพสนาม (คลิกเพื่อเปลี่ยน)</label>
            <div 
              onClick={handleOpenPicker}
              className="w-full h-48 bg-[#F4F7FA] rounded-[1.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-[#4DA3FF] transition-all group shadow-inner"
            >
              {selectedImg ? (
                <img 
                    // ✅ แก้ไขส่วนแสดงผลรูปภาพให้ดึงจาก Backend ได้ถูกต้อง
                    src={selectedImg.startsWith('http') ? selectedImg : `${API_BASE_URL}${selectedImg}`} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    alt="Field Preview" 
                />
              ) : (
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🖼️</span>
                  <p className="text-slate-400 font-bold text-sm">ยังไม่มีรูปภาพ กดเพื่อเลือก</p>
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
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

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

          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">รายละเอียดสนาม</label>
            <textarea 
              className="w-full p-5 bg-[#F4F7FA] rounded-[1.2rem] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white outline-none transition-all h-32 font-medium text-[#0B2E5E] resize-none"
              placeholder="ข้อมูลสิ่งอำนวยความสะดวก..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

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