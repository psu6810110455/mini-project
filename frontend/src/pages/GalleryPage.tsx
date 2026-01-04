import axios from "axios";
import Swal from "sweetalert2";

export default function GalleryPage() {
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // ดึงไฟล์ที่เลือกมา
    if (!file) return;

    // 1. เตรียมข้อมูลส่งไป Backend
    const formData = new FormData();
    formData.append("image", file); // ชื่อ "image" ต้องตรงกับใน Backend

    try {
      // 2. ยิง API ไปที่ Backend
      const res = await axios.post("http://localhost:3000/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // 3. ถ้าสำเร็จ
      Swal.fire("สำเร็จ!", `อัปโหลดรูปไปที่: ${res.data.url}`, "success");
      
    } catch (error) {
      Swal.fire("ผิดพลาด!", "อัปโหลดไม่สำเร็จ ตรวจสอบ Console", "error");
      console.error(error);
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-5">อัปโหลดรูปภาพเข้าคลัง</h1>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        className="block mx-auto border p-2 rounded-lg"
      />
      <p className="mt-4 text-gray-500">เลือกไฟล์ .jpg หรือ .png เพื่ออัปโหลด</p>
    </div>
  );
}