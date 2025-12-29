import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface UserToken {
  username: string;
  role: string;
}

interface SportField {
  id: number;
  name: string;
  type: string;
  // price: number; 👈 ไม่ต้องใช้แล้วในหน้านี้
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserToken | null>(null);
  const [fields, setFields] = useState<SportField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded: UserToken = jwtDecode(token);
      setUser(decoded);
      fetchFields(token);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const fetchFields = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:3000/sport-fields", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(response.data);
    } catch (error) {
      alert("ดึงข้อมูลไม่สำเร็จ ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ยืนยันจะลบสนามนี้ใช่ไหม?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/sport-fields/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("ลบสำเร็จ! 🗑️");
      if (token) fetchFields(token);
    } catch (error) {
      alert("ลบไม่สำเร็จ ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="text-center mt-10">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">⚽ รายชื่อสนามบอล</h1>
            <p className="text-gray-600 mt-1">
              สวัสดีคุณ <span className="font-bold">{user?.username}</span> 
            </p>
          </div>
          <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ออกจากระบบ
          </button>
        </div>

        {user?.role === 'admin' && (
          <div className="mb-4 text-right">
            <button 
              onClick={() => navigate("/add-field")}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 shadow flex items-center gap-2 ml-auto"
            >
              <span>+</span> เพิ่มสนามใหม่
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 border text-left text-blue-800">ID</th>
                <th className="py-3 px-4 border text-left text-blue-800">ชื่อสนาม</th>
                <th className="py-3 px-4 border text-left text-blue-800">ประเภท</th>
                {/* ❌ ลบคอลัมน์ราคาออกแล้ว */}
                {user?.role === 'admin' && <th className="py-3 px-4 border text-center text-blue-800">จัดการ</th>}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border">{field.id}</td>
                  <td className="py-3 px-4 border font-medium">{field.name}</td>
                  <td className="py-3 px-4 border">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {field.type}
                    </span>
                  </td>
                  {/* ❌ ลบข้อมูลราคาออกแล้ว */}
                  
                  {user?.role === 'admin' && (
                    <td className="py-3 px-4 border text-center space-x-2">
                      <button onClick={() => navigate(`/edit-field/${field.id}`)} className="bg-yellow-400 text-white px-3 py-1 rounded text-sm hover:bg-yellow-500">
                        แก้ไข
                      </button>
                      <button onClick={() => handleDelete(field.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                        ลบ
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}