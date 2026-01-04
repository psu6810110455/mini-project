import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    fetchFields();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("ยืนยันการลบสนามนี้?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/sport-fields/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(fields.filter(f => f.id !== id));
      alert("ลบสนามสำเร็จ ✅");
    } catch (err) {
      alert("ไม่สามารถลบสนามได้");
    }
  };

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 antialiased pb-20">
      
      {/* --- NAVBAR: ปรับสีน้ำเงินเข้มตาม Reference --- */}
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
              onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
              className="px-4 py-1.5 rounded-lg bg-[#E14D4D] hover:bg-red-600 text-xs font-bold shadow-lg transition-all"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* --- HEADER & SEARCH BOX: ปรับความมน (Rounded) มากพิเศษตามรูป --- */}
        <div className="bg-[#fff3e0] p-8 rounded-[2.5rem] shadow-sm mb-10 border border-white flex flex-col md:flex-row items-center gap-6">
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
              className="w-full bg-[#F4F7FA] border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</div>
            <button className="absolute right-1 top-1 bottom-1 bg-[#0B2E5E] text-white px-5 rounded-lg hover:bg-[#1a3a6b] transition-colors">
              <span className="text-sm">ค้นหา</span>
            </button>
          </div>

          <div className="flex bg-[#F4F7FA] p-1.5 rounded-xl shrink-0">
            <button onClick={() => setViewMode('grid')} className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-[#0B2E5E] text-white shadow-md' : 'text-slate-400'}`}>กริด</button>
            <button onClick={() => setViewMode('list')} className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-[#0B2E5E] text-white shadow-md' : 'text-slate-400'}`}>แถว</button>
          </div>
        </div>

        {isAdmin && (
          <button 
            onClick={() => navigate("/add-field")}
            className="mb-8 bg-[#0B2E5E] text-white px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center gap-2 shadow-xl active:scale-95 text-sm"
          >
            ➕ เพิ่มสนามใหม่ (Admin)
          </button>
        )}

        {/* --- FIELD CARDS: เน้นความโค้งมนและ Layout ตามรูป --- */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {filteredFields.map((field) => (
            <div 
              key={field.id} 
              className={`bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 hover:shadow-xl transition-all duration-300 flex flex-col ${
                viewMode === 'list' ? 'md:flex-row md:items-center gap-6' : ''
              }`}
            >
              {/* Image Section (สีพื้นหลังเหมือนรูปตัวอย่าง) */}
              <div className={`bg-[#D9E4EE] rounded-[1.5rem] overflow-hidden relative mb-4 ${viewMode === 'list' ? 'md:mb-0 md:w-48 h-32' : 'aspect-video'}`}>
                <img 
                  src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800" // รูป placeholder สนามกีฬา
                  alt="field"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#4DA3FF] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    {field.type || "SPORTS"}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800 mb-1">{field.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                  {field.description}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/booking/${field.id}`)}
                    className="flex-1 bg-[#0B2E5E] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#1a3a6b] transition-all shadow-lg active:scale-95"
                  >
                    เลือกจองสนาม
                  </button>

                  {isAdmin && (
                    <div className="flex gap-1.5">
                      <button onClick={() => navigate(`/edit-field/${field.id}`)} className="p-3 bg-[#F4F7FA] text-slate-400 rounded-xl hover:text-blue-600 transition-all">⚙️</button>
                      <button onClick={() => handleDelete(field.id)} className="p-3 bg-[#F4F7FA] text-slate-400 rounded-xl hover:text-red-600 transition-all">🗑️</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFields.length === 0 && (
          <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-slate-400 font-bold">ไม่พบสนามที่คุณต้องการค้นหา</p>
          </div>
        )}
      </main>
    </div>
  );
}