import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"; // ✅ นำเข้า SweetAlert2

interface SportField {
  id: number;
  name: string;
  description: string;
  type: string;
}

export default function FieldListPage() {
  const [fields, setFields] = useState<SportField[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลสนาม
  const fetchFields = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/sport-fields", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setFields(res.data);
    } catch (err) {
      console.error("ดึงข้อมูลไม่สำเร็จ", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.role === "admin") setIsAdmin(true);
      } catch (e) {
        console.error("Token invalid");
      }
    }
    fetchFields();
  }, []);

  // ฟังก์ชันลบสนามพร้อม SweetAlert2
  const handleDelete = async (id: number) => {
    // ✅ ใช้ SweetAlert2 แทน window.confirm
    const result = await Swal.fire({
      title: 'ยืนยันการลบสนามนี้?',
      text: "ข้อมูลสนามจะถูกลบออกถาวรและไม่สามารถเรียกคืนได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B2E5E', // สีน้ำเงินธีมคุณ
      cancelButtonColor: '#F4F7FA',
      confirmButtonText: 'ยืนยันการลบ',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[2.5rem] p-10 font-["Noto_Sans_Thai_Looped"]',
        confirmButton: 'bg-[#0B2E5E] text-white px-8 py-3 rounded-2xl font-bold mx-2 shadow-lg shadow-[#0B2E5E]/20',
        cancelButton: 'bg-[#F4F7FA] text-slate-400 px-8 py-3 rounded-2xl font-bold mx-2'
      }
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/sport-fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // กรองข้อมูลออกทันที
        setFields(fields.filter(f => f.id !== id));

        // ✅ แจ้งเตือนสำเร็จ
        Swal.fire({
          title: 'ลบสำเร็จ! ✅',
          text: 'ข้อมูลสนามถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonColor: '#0B2E5E',
          customClass: {
            popup: 'rounded-[2rem]'
          }
        });
      } catch (err) {
        Swal.fire({
          title: 'ผิดพลาด ❌',
          text: 'ไม่สามารถลบสนามได้ กรุณาลองใหม่',
          icon: 'error',
          confirmButtonColor: '#0B2E5E',
        });
      }
    }
  };

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 antialiased pb-20">
      
      {/* NAVBAR */}
      <nav className="bg-[#0B2E5E] shadow-md sticky top-0 z-50 text-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/fields")}>
            <h1 className="text-3xl font-black tracking-tight">
              จอง<span className="text-[#4DA3FF]">สนาม</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-all border border-white/20 flex items-center gap-2"
            >
              📋 ประวัติการจอง
            </button>
            <button 
              onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
              className="px-4 py-1.5 rounded-lg bg-[#E14D4D] hover:bg-red-600 text-xs font-bold shadow-lg transition-all"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* HEADER & SEARCH BOX */}
        <div className="bg-[#f2eddd] p-8 rounded-[2.5rem] shadow-sm mb-10 border border-white flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-5xl font-black text-[#0B2E5E] tracking-tight">รายการสนาม</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium italic">ค้นหาสถานที่ออกกำลังกายที่คุณต้องการ</p>
          </div>

          <div className="flex-[2] w-full relative group">
            <input 
              type="text" 
              placeholder="ค้นหาชื่อสนามที่ต้องการ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-transparent focus:border-[#4DA3FF] rounded-[1.5rem] py-4 pl-12 pr-4 text-sm focus:outline-none transition-all shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</div>
          </div>

          <div className="flex bg-white/50 p-1.5 rounded-2xl shrink-0">
            <button onClick={() => setViewMode('grid')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'grid' ? 'bg-[#0B2E5E] text-white shadow-md' : 'text-slate-400'}`}>กริด</button>
            <button onClick={() => setViewMode('list')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'list' ? 'bg-[#0B2E5E] text-white shadow-md' : 'text-slate-400'}`}>แถว</button>
          </div>
        </div>

        {isAdmin && (
          <button 
            onClick={() => navigate("/add-field")}
            className="mb-8 bg-[#0B2E5E] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#1a3a6b] transition-all flex items-center gap-2 shadow-xl active:scale-95 text-sm"
          >
            ➕ เพิ่มสนามกีฬาใหม่
          </button>
        )}

        {/* FIELD LISTING */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {filteredFields.map((field) => (
            <div 
              key={field.id} 
              className={`bg-white rounded-[2.5rem] p-6 shadow-sm border border-white hover:shadow-2xl transition-all duration-500 flex flex-col group ${
                viewMode === 'list' ? 'md:flex-row md:items-center gap-6' : ''
              }`}
            >
              <div className={`bg-[#F0F4F8] rounded-[2rem] overflow-hidden relative mb-4 transition-transform duration-500 group-hover:scale-[1.02] ${viewMode === 'list' ? 'md:mb-0 md:w-56 h-36 shrink-0' : 'aspect-[4/3]'}`}>
                <img 
                  src={`https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800`} // Placeholder image
                  alt="field"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#4DA3FF] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    {field.type}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-[#0B2E5E] mb-2">{field.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                  {field.description || "สัมผัสประสบการณ์การเล่นกีฬาที่ยอดเยี่ยมบนสนามมาตรฐานสากล พร้อมสิ่งอำนวยความสะดวกครบครัน"}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/booking/${field.id}`)}
                    className="flex-1 bg-[#0B2E5E] text-white py-4 rounded-2xl text-sm font-black hover:bg-[#1a3a6b] transition-all shadow-lg active:scale-95"
                  >
                    จองสนามนี้
                  </button>

                  {isAdmin && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/edit-field/${field.id}`)} 
                        className="p-4 bg-[#F4F7FA] text-slate-400 rounded-2xl hover:text-[#0B2E5E] hover:bg-white border border-transparent hover:border-slate-100 transition-all shadow-sm"
                      >
                        ⚙️
                      </button>
                      <button 
                        onClick={() => handleDelete(field.id)} 
                        className="p-4 bg-[#F4F7FA] text-slate-400 rounded-2xl hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all shadow-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-32 bg-white/40 rounded-[3rem] border-4 border-dashed border-white">
            <div className="text-7xl mb-6">🔭</div>
            <p className="text-[#0B2E5E] font-black text-xl">ไม่พบรายชื่อสนามที่คุณค้นหาในขณะนี้</p>
            <button onClick={() => setSearchTerm("")} className="mt-4 text-[#4DA3FF] font-bold underline">ล้างการค้นหา</button>
          </div>
        )}
      </main>
    </div>
  );
}