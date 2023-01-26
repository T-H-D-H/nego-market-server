export interface Address {
  id: number;
  si: string;
  gu: string;
  dong: string;
  created_at: Date;
  last_updated_at: Date;
}

export interface AddressSi {
  si: string;
}

export interface AddressGu {
  gu: string;
}

export interface AddressDong {
  dong: string;
}
