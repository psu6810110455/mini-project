import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000";

export interface SportField {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  categoryId: number;
}

export default function EditFieldPage() {
  const { id } = useParams(); // รับ ID จาก URL
  const navigate = useNavigate();
  
  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState<Omit<SportField, "id">>({
    name: "",
    description: "",
    type: "",
    price: 0,
    categoryId: 0,
  });

  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลเดิมมาแสดงในฟอร์ม
  useEffect(() => {
    const fetchFieldData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/sport-fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // ใส่ข้อมูลที่ดึงมาลงใน state
        setFormData({
          name: res.data.name,
          description: res.data.description,
          type: res.data.type,
          price: res.data.price,
          categoryId: res.data.categoryId,
        });
      } catch (error) {
        console.error("Error fetching field data:", error);
        alert("ไม่พบข้อมูลสนามนี้");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchFieldData();
  }, [id, navigate]);

  // 2. ฟังก์ชันจัดการการเปลี่ยนแปลงใน Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "categoryId" ? Number(value) : value,
    }));
  };

  // 3. ฟังก์ชัน Submit เพื่อ Update ข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/sport-fields/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("อัปเดตข้อมูลสำเร็จ ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating field:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้ ❌");
    }
  };

  if (loading) return <div className="text-center mt-10">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">แก้ไขข้อมูลสนาม</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อสนาม</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ประเภท (เช่น ฟุตบอล, แบดมินตัน)</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ราคาต่อชั่วโมง</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}