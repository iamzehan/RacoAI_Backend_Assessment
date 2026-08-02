import axios, { AxiosError } from "axios";

export interface ApiEnvelope<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface User {
  userId: string;
  email: string;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
  accessToken?: string;
}

export interface Profile {
  id?: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  children?: Category[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: string | number;
  status: string;
  stock?: { quantity: number; productId?: string };
  categories?: { categories?: Category }[];
}

export interface Paginated<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string | number;
  createdAt: string;
  items?: {
    id: string;
    productName: string;
    quantity: number;
    subtotal: string | number;
  }[];
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  withCredentials: true
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("raco_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function message(error: unknown) {
  const response = error as AxiosError<{ message?: string }>;

  return (
    response.response?.data?.message ??
    "Something went wrong. Please try again."
  );
}

async function unwrap<T>(
  request: Promise<{ data: ApiEnvelope<T> | T }>
): Promise<T> {
  try {
    const response = await request;
    const body = response.data;

    return (
      body && typeof body === "object" && "data" in body ? body.data : body
    ) as T;
  } catch (error) {
    throw new Error(message(error));
  }
}

export const api = {
  login: (email: string, password: string) =>
    unwrap<User>(client.post("/auth/login", { email, password })),

  register: (payload: Record<string, string>) =>
    unwrap<unknown>(client.post("/auth/register", payload)),

  logout: () => client.post("/auth/logout").catch(() => undefined),

  profile: () => unwrap<Profile>(client.get("/v1/user/profile/me")),

  updateProfile: (payload: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  }) => unwrap<Profile>(client.patch("/v1/user/profile/me", payload)),

  admins: () => unwrap<Profile[]>(client.get("/v1/user/admins")),

  updateAdminProfile: (id: string, payload: Omit<Profile, "id" | "role">) =>
    unwrap<Profile>(client.patch(`/v1/user/admins/${id}`, payload)),

  products: (params: Record<string, string | number | undefined> = {}) =>
    unwrap<Paginated<Product>>(client.get("/v1/products", { params })),

  categories: () => unwrap<Category[]>(client.get("/v1/categories")),

  categoryTree: () => unwrap<Category[]>(client.get("/v1/categories/tree")),

  orders: (params: Record<string, string | number | undefined> = {}) =>
    unwrap<Paginated<Order>>(client.get("/v1/orders", { params })),

  createOrder: (items: { productId: string; quantity: number }[]) =>
    unwrap<Order>(client.post("/v1/orders", { items })),

  cancelOrder: (id: string) =>
    unwrap<Order>(client.patch(`/v1/orders/${id}/cancel`)),

  generateSku: () =>
    unwrap<{ sku: string }>(client.get("/v1/products/sku")),

  createProduct: (payload: Record<string, unknown>) =>
    unwrap<Product>(client.post("/v1/products", payload)),

  updateProduct: (payload: Record<string, unknown>) =>
    unwrap<Product>(client.patch("/v1/products", payload)),

  deleteProduct: (id: string) =>
    unwrap<unknown>(client.delete(`/v1/products/${id}`)),

  createCategory: (payload: Record<string, unknown>) =>
    unwrap<Category>(client.post("/v1/categories", payload)),

  updateCategory: (id: string, payload: Record<string, unknown>) =>
    unwrap<Category>(client.patch(`/v1/categories/${id}`, payload)),

  deleteCategory: (id: string) =>
    unwrap<unknown>(client.delete(`/v1/categories/${id}`)),

  updateOrderStatus: (id: string, status: string) =>
    unwrap<Order>(client.patch(`/v1/orders/${id}/status`, { status }))
};
