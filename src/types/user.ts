export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  nickname: string;
  tel: string;
  address_id: number;
  created_at: Date;
  last_updated_at: Date;
}
