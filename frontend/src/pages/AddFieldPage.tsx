import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddFieldPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("ฟุตบอล 7 คน");
  const [description, setDescription] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // ✅ แก้ไขข้อมูลที่ส่งไปยัง Backend ให้ครบตามที่ Database ต้องการ
      await axios.post(
        "http://localhost:3000/sport-fields",
        { 
          name, 
          price: 0,            // ✅ ส่ง 0 ไป (เพราะคุณไม่เอาราคา)
          type,
          description: description || "-", // ✅ ส่งค่าไปเพื่อแก้ NOT NULL description
          categoryId: 1,       // ✅ ส่งเลข 1 ไปเพื่อแก้ NOT NULL categoryId
          category_id: 1       // ✅ ส่งเผื่อไว้ตามที่ Log หลังบ้านเรียกหา
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("เพิ่มสนามสำเร็จ! ✅");
      navigate("/dashboard");

    } catch (error) {
      console.error("Add Field Error:", error);
      alert("เพิ่มสนามไม่สำเร็จ ❌ ตรวจสอบว่ามีข้อมูลในตาราง Category หรือยัง");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700">เพิ่มสนามใหม่</h2>
        
        <form onSubmit={handleAdd} className="space-y-4">
          {/* ชื่อสนาม */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">ชื่อสนาม</label>
            <input
              type="text"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น สนามฟุตบอล A"
              required
            />
          </div>

          {/* รายละเอียด (Description) */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">รายละเอียด</label>
            <textarea
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุรายละเอียดเพิ่มเติม..."
              rows={3}
            />
          </div>

          {/* ประเภทสนาม */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">ประเภทสนาม</label>
            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
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

          {/* ปุ่มกด */}
          <div className="flex space-x-2 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition"
            >
              บันทึกสนาม
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard")} 
              className="flex-1 bg-gray-400 text-white py-2 rounded font-bold hover:bg-gray-500 transition"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}