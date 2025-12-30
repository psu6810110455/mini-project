export interface SportField {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  categoryId: number;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}