export class CreateSportFieldDto {
  name: string;
  description: string;
  // price_per_hour: number;  <-- ลบบรรทัดนี้ทิ้ง หรือ comment ไว้ครับ
  categoryId: number;
}