// src/pages/BookingPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookingPage() {
  const { fieldId } = useParams(); // รับค่า ID จาก URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingDate: "",
    startTime: "",
    endTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/bookings",
        {
          ...formData,
          sportFieldId: Number(fieldId), // ใช้ fieldId ที่รับมา
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("จองสำเร็จ! ✅");
      navigate("/my-bookings");
    } catch (err: any) {
      alert(err.response?.data?.message || "จองไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">เลือกวันและเวลา</h2>
        <div className="space-y-4">
          <input 
            type="date" 
            className="w-full border p-3 rounded-lg" 
            onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
            required 
          />
          <input 
            type="time" 
            className="w-full border p-3 rounded-lg" 
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            required 
          />
          <input 
            type="time" 
            className="w-full border p-3 rounded-lg" 
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            required 
          />
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-bold">
            ยืนยันการจอง
          </button>
        </div>
      </form>
    </div>
  );
}