export interface ProductData {
  color?: string;
  capacity?: string;
  'capacity GB'?: number;
}

export interface Product {
  id: string;
  name: string;
  data: ProductData | null;
}