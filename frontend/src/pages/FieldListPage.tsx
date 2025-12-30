import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ ต้องลงเพิ่ม: npm install jwt-decode

interface SportField {
  id: number;
  name: string;
  description: string;
  type: string;
}

export default function FieldListPage() {
  const [fields, setFields] = useState<SportField[]>([]);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ สถานะเช็คว่าเป็น Admin ไหม
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // ✅ เช็ค Role จาก Token (สมมติว่า Backend ส่ง role: 'admin' มา)
        if (decoded.role === "admin") setIsAdmin(true);
      } catch (e) {
        console.error("Token invalid");
      }
    }

    const fetchFields = async () => {
      try {
        const res = await axios.get("http://localhost:3000/sport-fields", {
          headers: { Authorization: `Bearer ${token}` },
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
      setFields(fields.filter(f => f.id !== id)); // ลบออกจากหน้าจอทันที
      alert("ลบสนามสำเร็จ ✅");
    } catch (err) {
      alert("ไม่สามารถลบสนามได้");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/fields")}>
          <span className="text-2xl">🏟️</span>
          <h2 className="text-xl font-bold text-blue-600">SportCenter {isAdmin && "(Admin)"}</h2>
        </div>
        <div className="flex items-center gap-6">
          {/* ✅ ถ้าเป็น Admin ให้เห็นปุ่มเพิ่มสนาม */}
          {isAdmin && (
            <button 
              onClick={() => navigate("/add-field")}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition"
            >
              + เพิ่มสนาม
            </button>
          )}
          <button onClick={() => navigate("/my-bookings")} className="text-gray-600 font-medium">ประวัติการจอง</button>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition">ออกจากระบบ</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">รายการสนามทั้งหมด</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fields.map((field) => (
            <div key={field.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{field.name}</h2>
                <p className="text-gray-500 mb-6 h-12 line-clamp-2">{field.description}</p>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/booking/${field.id}`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    เลือกจองสนามนี้
                  </button>

                  {/* ✅ ถ้าเป็น Admin ให้เห็นปุ่มแก้ไขและลบ */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => navigate(`/edit-field/${field.id}`)}
                        className="flex-1 bg-amber-50 text-amber-600 py-2 rounded-lg font-bold hover:bg-amber-100"
                      >
                        แก้ไข
                      </button>
                      <button 
                        onClick={() => handleDelete(field.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100"
                      >
                        ลบ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}