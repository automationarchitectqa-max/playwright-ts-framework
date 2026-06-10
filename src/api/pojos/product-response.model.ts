export interface ProductResponse {
  id: string;
  name: string;
  data: ProductData;
  createdAt: string;
}

export interface ProductData {
  year: number;
  price: number;
  'CPU model': string;
  'Hard disk size': string;
}