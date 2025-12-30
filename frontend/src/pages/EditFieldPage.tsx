import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFieldPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // ดึง ID จาก URL

  // สร้าง State สำหรับเก็บข้อมูลฟอร์ม
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลสนามเดิมมาแสดงผล
  useEffect(() => {
    const fetchField = async () => {
      // ตรวจสอบว่า id ไม่เป็น undefined หรือ NaN ก่อนยิง API
      if (!id || isNaN(Number(id))) {
        console.error("Invalid ID found:", id);
        alert("ไม่พบรหัสสนามที่ต้องการแก้ไข");
        navigate("/dashboard");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/sport-fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // นำข้อมูลที่ได้มาใส่ใน State
        setName(response.data.name || "");
        setType(response.data.type || "");
        setDescription(response.data.description || "");
        setLoading(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("ไม่สามารถดึงข้อมูลสนามได้");
        navigate("/dashboard");
      }
    };

    fetchField();
  }, [id, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `http://localhost:3000/sport-fields/${id}`,
        { 
          name, 
          type, 
          description: description || "-", 
          price: 0,           // ✅ บังคับส่งราคาเป็น 0 เสมอตามความต้องการของคุณ
          categoryId: 1       // ✅ ส่ง categoryId เพื่อป้องกัน Error 500 จาก Backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("แก้ไขข้อมูลเรียบร้อยแล้ว! ✨");
      navigate("/dashboard");
    } catch (error) {
      console.error("Update Error:", error);
      alert("แก้ไขข้อมูลไม่สำเร็จ ❌");
    }
  };

  if (loading) return <div className="text-center mt-10">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-green-700">แก้ไขข้อมูลสนาม</h2>
        <p className="text-gray-500 mb-6 text-sm">รหัสสนาม: {id}</p>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* ชื่อสนาม */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อสนาม</label>
            <input
              type="text"
              className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* ประเภทสนาม */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ประเภทกีฬา</label>
            <select
              className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="ฟุตบอล 7 คน">ฟุตบอล 7 คน</option>
              <option value="ฟุตบอล 11 คน">ฟุตบอล 11 คน</option>
              <option value="ฟุตซอล">ฟุตซอล</option>
              <option value="บาสเกตบอล">บาสเกตบอล</option>
              <option value="แบดมินตัน">แบดมินตัน</option>
            </select>
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">รายละเอียด</label>
            <textarea
              className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="ระบุรายละเอียดสนาม..."
            />
          </div>

          {/* ปุ่มกด */}
          <div className="flex flex-col gap-2 pt-4">
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition active:scale-95"
            >
              บันทึกการแก้ไข
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard")} 
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}