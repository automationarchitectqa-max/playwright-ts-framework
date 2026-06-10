export interface ProductRequest {
  name: string;
  data: ProductData;
}

export interface ProductData {
  year: number;
  price: number;
  'CPU model': string;
  'Hard disk size': string;
}