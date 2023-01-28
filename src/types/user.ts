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

export interface UserMyPage {
  email: string;
  name: string;
  nickname: string;
  tel: string;
  si: string;
  gu: string;
  dong: string;
}

export interface UserEditGet {
  email: string;
  new_nickname: string;
  new_tel: string;
  new_address_name: string;
}
