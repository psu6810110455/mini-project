import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookingPage() {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [fieldName, setFieldName] = useState("กำลังโหลด...");
  
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  // ตัวเลือกเวลา
  const timeOptions = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

  useEffect(() => {
    const fetchFieldDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/sport-fields/${fieldId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFieldName(res.data.name);
      } catch (err) { console.error(err); }
    };
    fetchFieldDetail();
  }, [fieldId]);

  // ฟังก์ชันคำนวณจำนวนชั่วโมง
  const calculateDuration = () => {
    if (startTime && endTime) {
      const start = parseInt(startTime.split(":")[0]);
      const end = parseInt(endTime.split(":")[0]);
      return end - start;
    }
    return 0;
  };

  const handleTimeClick = (time: string) => {
    if (!startTime || (startTime && endTime)) {
      setStartTime(time);
      setEndTime(null);
    } else {
      if (time > startTime) setEndTime(time);
      else { setStartTime(time); setEndTime(null); }
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime) return alert("กรุณาเลือกข้อมูลให้ครบ");
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/bookings", 
        { bookingDate: selectedDate, startTime, endTime, sportFieldId: Number(fieldId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("จองสำเร็จ! ✅");
      navigate("/my-bookings");
    } catch (err: any) { alert(err.response?.data?.message || "จองไม่สำเร็จ"); }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#E9F1F7] font-['Noto_Sans_Thai_Looped',sans-serif] text-slate-900 pb-10">
      
      {/* 1. TOP SUMMARY CARD (สรุปข้อมูลและจำนวนชั่วโมง) */}
      <div className="bg-[#0B2E5E] text-white sticky top-0 z-50 shadow-2xl rounded-b-[2.5rem]">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
             <button onClick={() => navigate(-1)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all">
                <span className="px-2 text-sm font-bold">← ย้อนกลับ</span>
             </button>
             <h1 className="text-xl font-black">รายละเอียดการจอง</h1>
             <div className="w-20"></div>
          </div>
          
          <div className="bg-white/10 border border-white/20 rounded-[2rem] p-6 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="text-center md:text-center pb-4 md:pb-0">
                <p className="text-[15px] font-bold text-[#4DA3FF] uppercase tracking-widest mb-1">สนาม</p>
                <h2 className="text-2xl font-black">{fieldName}</h2>
              </div>
              
              <div className="text-center pt-4 md:pt-0">
                <p className="text-[15px] font-bold text-[#4DA3FF] uppercase tracking-widest mb-1">วันที่เลือก</p>
                <p className="text-xl font-black">{selectedDate ? new Date(selectedDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : "ยังไม่ได้เลือก"}</p>
              </div>

              <div className="text-center pt-4 md:pt-0">
                <p className="text-[15px] font-bold text-[#4DA3FF] uppercase tracking-widest mb-1">เวลาที่จอง ({calculateDuration()} ชม.)</p>
                <p className="text-xl font-black text-[#ffffff]">
                  {startTime ? `${startTime} - ${endTime || '?'}` : "รอกำหนด"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        
        {/* 2. DATE SELECTOR (เลือกได้ทั้งวัน เดือน ปี) */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-[#4DA3FF] rounded-full"></span>
              1. เลือกวันที่ เดือน/วัน/ปี
            </h3>
            {selectedDate && (
                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full border border-green-100">
                    เลือกแล้ว
                </span>
            )}
          </div>
          <div className="relative group">
            <input 
              type="date" 
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#F4F7FA] border-2 border-transparent focus:border-[#4DA3FF] focus:bg-white p-5 rounded-[1.5rem] outline-none transition-all font-black text-xl text-[#0B2E5E] appearance-none"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-2xl">📅</div>
          </div>
        </section>

        {/* 3. TIME RANGE SELECTION */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
          <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-[#4DA3FF] rounded-full"></span>
            2. ระบุช่วงเวลา (เริ่ม - สิ้นสุด)
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {timeOptions.map((time) => {
              const isSelected = time === startTime || time === endTime;
              const isInRange = startTime && endTime && time > startTime && time < endTime;
              return (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className={`py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                    isSelected 
                    ? 'bg-[#4DA3FF] border-[#4DA3FF] text-white shadow-lg' 
                    : isInRange 
                    ? 'bg-blue-50 border-blue-200 text-[#0B2E5E]'
                    : 'bg-[#F4F7FA] border-transparent text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
          
          {/* สรุปชั่วโมงแบบ Visual */}
          {startTime && endTime && (
            <div className="mt-8 bg-[#0B2E5E] p-4 rounded-2xl flex items-center justify-between text-white animate-pulse">
               <span className="text-sm font-bold">สรุปเวลาที่จองทั้งหมด:</span>
               <span className="text-xl font-black">{calculateDuration()} ชั่วโมง</span>
            </div>
          )}
        </section>

        {/* SUBMIT BUTTON */}
        <div className="pb-10">
          <button 
            onClick={handleSubmit}
            disabled={!selectedDate || !startTime || !endTime}
            className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all ${
              selectedDate && startTime && endTime
              ? 'bg-[#0B2E5E] text-white hover:bg-[#1a3a6b] hover:scale-[1.02] active:scale-95' 
              : 'bg-slate-300 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {selectedDate && startTime && endTime 
              ? `ยืนยันการจอง ${calculateDuration()} ชั่วโมง` 
              : 'กรุณากรอกข้อมูลให้ครบถ้วน'}
          </button>
        </div>

      </main>
    </div>
  );
}