import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("ยืนยันการยกเลิกการจองนี้? รายการจะถูกลบออกจากหน้าประวัติของคุณ")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // หลังจากยกเลิกสำเร็จ ให้เรียกฟังก์ชันดึงข้อมูลใหม่ เพื่ออัปเดตสถานะใน State
      fetchMyBookings();
    } catch (err) {
      alert("ไม่สามารถยกเลิกได้ในขณะนี้");
    }
  };

  // กรองรายการ: แสดงเฉพาะรายการที่สถานะไม่ใช่ 'cancelled'
  const activeBookings = bookings.filter((b) => b.status !== "cancelled");

  // ฟังก์ชันคำนวณชั่วโมง
  const getDuration = (start: string, end: string) => {
    const s = parseInt(start.split(":")[0]);
    const e = parseInt(end.split(":")[0]);
    return e - s;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E9F1F7] flex items-center justify-center font-['Noto_Sans_Thai_Looped']">
        <p className="font-bold text-[#0B2E5E] animate-pulse">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 pb-20">
      
      {/* NAVBAR */}
      <nav className="bg-[#0B2E5E] shadow-md sticky top-0 z-50 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-black cursor-pointer" onClick={() => navigate("/fields")}>
            จอง<span className="text-[#4DA3FF]">สนาม</span>
          </h1>
          <button 
            onClick={() => navigate("/fields")} 
            className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-xl text-sm font-bold transition-all border border-white/20"
          >
            ← กลับไปหน้ารวมสนาม
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-10">
        
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-[#0B2E5E]">ประวัติการจอง</h2>
            <p className="text-slate-400 font-medium mt-1">รายการที่จองสำเร็จและรอการใช้งาน</p>
          </div>
          <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-white text-sm font-bold text-[#0B2E5E]">
            รายการที่รอใช้งาน: {activeBookings.length} รายการ
          </div>
        </div>

        {/* BOOKING LIST - แสดงเฉพาะรายการที่ผ่านการ Filter แล้ว */}
        <div className="grid gap-6">
          {activeBookings.map((b: any) => (
            <div 
              key={b.id} 
              className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                   <span className="bg-[#F0F5FA] text-[#0B2E5E] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border border-slate-100">
                     ID: #{b.id}
                   </span>
                   <span className="bg-green-100 text-green-600 border border-green-200 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {b.status}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-[#0B2E5E] mb-2">
                  {b.sportField?.name || "สนามทั่วไป"}
                </h3>
                
                <div className="flex flex-wrap items-center gap-6 text-slate-500 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <span className="font-black text-slate-700">
                      {new Date(b.bookingDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏰</span>
                    <span className="font-black text-[#4DA3FF]">
                      {b.startTime} - {b.endTime}
                    </span>
                    <span className="text-xs font-bold text-slate-300">({getDuration(b.startTime, b.endTime)} ชม.)</span>
                  </div>
                </div>
              </div>

              {/* ปุ่มยกเลิก */}
              <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0">
                <button 
                  onClick={() => handleCancel(b.id)} 
                  className="w-full md:w-auto bg-[#FFF1F1] text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all shadow-sm active:scale-95"
                >
                  ยกเลิกการจองนี้
                </button>
              </div>
            </div>
          ))}

          {/* EMPTY STATE - แสดงเมื่อไม่มีรายการที่รอใช้งานเหลืออยู่ */}
          {activeBookings.length === 0 && (
            <div className="text-center py-24 bg-white/50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-6 grayscale opacity-40">🏟️</div>
              <p className="text-slate-400 font-black text-xl">ไม่มีรายการจองที่รอใช้งาน</p>
              <button 
                onClick={() => navigate("/fields")}
                className="mt-8 bg-[#0B2E5E] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#1a3a6b] transition-all shadow-xl active:scale-95"
              >
                ไปหน้าเลือกสนาม
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}