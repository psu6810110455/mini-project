import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddFieldPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // ดึง Token มายืนยันสิทธิ์ Admin
      
      // ✅ ส่งข้อมูลไปยัง API
      await axios.post("http://localhost:3000/sport-fields", 
        { 
          name, 
          type, 
          description 
        }, 
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      alert("เพิ่มสนามสำเร็จ! ✅");
      navigate("/fields"); // บันทึกเสร็จแล้ว กลับไปหน้ารวมสนาม
    } catch (err) {
      console.error("Error adding field:", err);
      alert("ไม่สามารถเพิ่มสนามได้ ❌ กรุณาลองใหม่");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl text-blue-600">➕</span>
          <h2 className="text-3xl font-extrabold text-gray-800">เพิ่มสนามใหม่</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">ชื่อสนาม</label>
            <input 
              type="text" 
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="เช่น สนามบาสเกตบอล 1"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">ประเภท</label>
            <input 
              type="text" 
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="เช่น บาสเกตบอล, ฟุตบอล"
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">รายละเอียด</label>
            <textarea 
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
              placeholder="ระบุข้อมูลเพิ่มเติม..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              บันทึก
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/fields")} 
              className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}