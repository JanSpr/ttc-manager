import { apiGet } from "./api";
import type { User } from "../types/user";

export async function fetchUsers(): Promise<User[]> {
  return apiGet<User[]>("/api/users");
}

export async function fetchUserById(id: number): Promise<User> {
  return apiGet<User>(`/api/users/${id}`);
}
