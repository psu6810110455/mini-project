import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      // เรียก API /my โดยตรงตามที่แก้ใน Backend
      const res = await axios.get("http://localhost:3000/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("ยืนยันการยกเลิกการจอง?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyBookings();
    } catch (err) {
      alert("ไม่สามารถยกเลิกได้");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ประวัติการจองของคุณ</h1>
          <button onClick={() => navigate("/fields")} className="text-blue-600 font-bold">กลับหน้ารวมสนาม</button>
        </div>
        <div className="grid gap-4">
          {bookings.map((b: any) => (
            <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-blue-600">{b.sportField?.name}</h3>
                <p className="text-gray-600">{b.bookingDate} ({b.startTime} - {b.endTime})</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {b.status.toUpperCase()}
                </span>
              </div>
              {b.status === 'confirmed' && (
                <button onClick={() => handleCancel(b.id)} className="text-red-500 font-bold">ยกเลิก</button>
              )}
            </div>
          ))}
          {bookings.length === 0 && <div className="text-center py-10 bg-white rounded-2xl">ยังไม่มีประวัติการจอง</div>}
        </div>
      </div>
    </div>
  );
}