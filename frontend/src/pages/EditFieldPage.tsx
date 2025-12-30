import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFieldPage() {
  const { id } = useParams(); // รับ ID จาก URL
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูลสนามเดิมมาใส่ในฟอร์ม
    const fetchField = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/sport-fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(res.data.name);
        setType(res.data.type);
        setDescription(res.data.description);
      } catch (err) {
        console.error("ดึงข้อมูลไม่สำเร็จ");
      }
    };
    fetchField();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/sport-fields/${id}`, 
        { name, type, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("แก้ไขข้อมูลสำเร็จ! ✅");
      navigate("/fields");
    } catch (err) {
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-lg border-t-8 border-amber-400">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">📝 แก้ไขข้อมูลสนาม</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">ชื่อสนาม</label>
            <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border" 
                   value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">ประเภท</label>
            <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border" 
                   value={type} onChange={(e) => setType(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">รายละเอียด</label>
            <textarea className="w-full p-4 bg-gray-50 rounded-xl border h-32" 
                      value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-amber-500 text-white py-4 rounded-2xl font-bold">อัปเดตข้อมูล</button>
            <button type="button" onClick={() => navigate("/fields")} className="flex-1 bg-gray-200 py-4 rounded-2xl font-bold">กลับ</button>
          </div>
        </form>
      </div>
    </div>
  );
}