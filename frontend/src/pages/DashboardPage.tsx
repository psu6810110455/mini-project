import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔒 Security Check: ถ้าไม่มี Token ให้ดีดกลับไปหน้า Login
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาล็อกอินก่อนใช้งาน!");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    // 🗑️ ลบ Token และออกจากระบบ
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🎉 ยินดีต้อนรับสู่ Dashboard!
        </h1>
        <p className="text-gray-700 text-xl mb-8">
          คุณเข้าสู่ระบบสำเร็จแล้ว และมี Token เรียบร้อย
        </p>
        
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition font-bold"
        >
          ออกจากระบบ (Logout)
        </button>
      </div>
    </div>
  );
}