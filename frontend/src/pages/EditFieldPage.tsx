import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFieldPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  // ❌ ลบ state price ออก
  const [type, setType] = useState("");

  useEffect(() => {
    const fetchField = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/sport-fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        // setPrice(response.data.price); 👈 ไม่เอามาโชว์แล้ว
        setType(response.data.type);
      } catch (error) {
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
          // ไม่ส่ง price ไป update (ใช้ค่าเดิมใน DB หรือปล่อยผ่าน)
          type 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("แก้ไขเรียบร้อย! ✨");
      navigate("/dashboard");

    } catch (error) {
      alert("แก้ไขไม่สำเร็จ ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-yellow-600">แก้ไขสนาม (ID: {id})</h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">ชื่อสนาม</label>
            <input
              type="text"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* ❌ ลบช่องแก้ไขราคาออกแล้ว */}

          <div>
            <label className="block text-gray-700 mb-1">ประเภทสนาม</label>
            <select
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="ฟุตบอล 7 คน">ฟุตบอล 7 คน</option>
              <option value="ฟุตบอล 11 คน">ฟุตบอล 11 คน</option>
              <option value="ฟุตซอล">ฟุตซอล</option>
              <option value="บาสเกตบอล">บาสเกตบอล</option>
            </select>
          </div>

          <div className="flex space-x-2 pt-4">
            <button type="submit" className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
              บันทึกการแก้ไข
            </button>
            <button type="button" onClick={() => navigate("/dashboard")} className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500">
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}