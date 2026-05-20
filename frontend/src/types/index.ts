export interface User {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "employee";
}

export interface Product {
  id: number;
  name: string;
  Price: number;
  tax: number;
  description: string;
  dept_id: number | null;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalbusiness: number | null;
}

export interface Sale {
  id: number;
  productName: string;
  clientName: string;
  total: number;
  status: string;
  type: string;
  sale_date: string;
}

export interface Payment {
  sale_id: number;
  amount: number;
}

export interface PaymentWithDetails {
  id: number;
  type: string;
  status: string;
  clientName: string;
  saleId: number;
  paidAmount: number;
  total: string;
  remaining: number;
}
