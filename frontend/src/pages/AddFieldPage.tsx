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
      // ✅ ส่งข้อมูลไปยัง Backend โดยกำหนด price เป็น 0 อัตโนมัติ
      await axios.post(
        "http://localhost:3000/sport-fields",
        { 
          name, 
          price: 0,                   // ❌ ไม่เอาการใส่ราคา กำหนดเป็น 0 ทันที
          type,
          description: description || "-", // ป้องกันค่าว่างถ้า DB บังคับ NOT NULL
          categoryId: 1               // กำหนด ID หมวดหมู่พื้นฐาน (ต้องมีใน DB)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("เพิ่มสนามสำเร็จ! ✅");
      navigate("/dashboard");

    } catch (error) {
      console.error("Add Field Error:", error);
      alert("เพิ่มสนามไม่สำเร็จ ❌ ตรวจสอบการเชื่อมต่อ Backend");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-green-700">เพิ่มสนามใหม่</h2>
        <p className="text-gray-500 mb-6">กรอกรายละเอียดสนามที่ต้องการเปิดให้บริการ</p>
        
        <form onSubmit={handleAdd} className="space-y-5">
          {/* ชื่อสนาม */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อสนาม</label>
            <input
              type="text"
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น สนามเทพประทาน"
              required
            />
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">รายละเอียดสนาม</label>
            <textarea
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="หญ้าเทียมเกรด A, มีไฟส่องสว่าง..."
              rows={3}
            />
          </div>

          {/* ประเภทสนาม */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ประเภทกีฬา</label>
            <select
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition appearance-none bg-white"
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

          {/* ปุ่มบันทึก/ยกเลิก */}
          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-200 transition active:scale-95"
            >
              บันทึกข้อมูลสนาม
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