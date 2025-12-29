import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Facility {
  id: number;
  name: string;
  type: string;
  price: number;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // ดึงข้อมูลสนามจาก Backend (ถ้า Backend ยังไม่พร้อม จะไม่ Error แต่จะว่างเปล่า)
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const token = localStorage.getItem("token");
        // ยิงไปที่ API เดียวกับที่คุณใช้หน้า Dashboard
        const res = await axios.get("http://localhost:3000/sport-fields", {
           headers: { Authorization: `Bearer ${token}` }
        });
        setFacilities(res.data);
      } catch (error) {
        console.log("ยังเชื่อมต่อ Backend ไม่ได้ หรือไม่มีข้อมูล ใช้ข้อมูลจำลองแทน...");
        // ข้อมูลจำลอง (ถ้า API พัง ให้ใช้ชุดนี้)
        setFacilities([
           { id: 991, type: 'swimming', name: 'สระว่ายน้ำระบบเกลือ', price: 150 },
           { id: 992, type: 'badminton', name: 'สนามแบดมินตัน A', price: 180 },
           { id: 993, type: 'boxing', name: 'เวทีมวยมาตรฐาน', price: 250 },
           { id: 994, type: 'fitness', name: 'ฟิตเนส รายวัน', price: 100 },
        ]);
      }
    };
    fetchFields();
  }, []);

  const filteredFacilities = facilities.filter(facility => 
    filter === 'all' ? true : facility.type === filter
  );

  const getThaiType = (type: string) => {
    const types: { [key: string]: string } = {
      'football': 'ฟุตบอล',
      'swimming': 'ว่ายน้ำ', 'badminton': 'แบดมินตัน',
      'tennis': 'เทนนิส', 'pingpong': 'ปิงปอง',
      'boxing': 'มวย', 'fitness': 'ฟิตเนส'
    };
    return types[type] || type;
  };

  const handleBookingConfirm = () => {
      alert(`✅ จองสำเร็จ: ${selectedFacility?.name}`);
      setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-blue-800">🏟️ จองสนามกีฬา</h1>
                <p className="text-gray-600">เลือกประเภทกีฬาที่คุณต้องการ</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-sm bg-gray-200 px-3 py-1 rounded">กลับ Dashboard</button>
        </header>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4 overflow-x-auto">
          <span className="font-semibold text-gray-700 whitespace-nowrap">เลือกกีฬา:</span>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
          >
            <option value="all">ทั้งหมด</option>
            <option value="swimming">🏊 สระว่ายน้ำ</option>
            <option value="badminton">🏸 แบดมินตัน</option>
            <option value="tennis">🎾 เทนนิส</option>
            <option value="pingpong">🏓 ปิงปอง</option>
            <option value="boxing">🥊 สนามมวย</option>
            <option value="fitness">💪 ฟิตเนส</option>
            <option value="football">⚽ ฟุตบอล</option>
          </select>
        </div>

        {/* Grid รายการสนาม */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border-l-4 border-blue-500">
              <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{facility.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {getThaiType(facility.type)}
                    </span>
                </div>
                <div className="mt-4 flex justify-between items-end">
                    <p className="text-gray-600">ราคา: <span className="text-2xl font-bold text-green-600">{facility.price}</span> บ./ชม.</p>
                    <button 
                        onClick={() => { setSelectedFacility(facility); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        จองเลย
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal ยืนยัน */}
        {isModalOpen && selectedFacility && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                    <h2 className="text-xl font-bold mb-4">ยืนยันการจอง</h2>
                    <p className="mb-2">สถานที่: <strong>{selectedFacility.name}</strong></p>
                    <p className="mb-4">ราคา: {selectedFacility.price} บาท</p>
                    <div className="flex gap-2">
                        <button onClick={handleBookingConfirm} className="flex-1 bg-green-500 text-white py-2 rounded">ยืนยัน</button>
                        <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-300 py-2 rounded">ยกเลิก</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;