import { apiGet, apiPut } from "./api";
import type { User } from "../types/user";

export type UpdateOwnUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};

export async function fetchUsers(): Promise<User[]> {
  return apiGet<User[]>("/api/users");
}

export async function fetchUserById(id: number): Promise<User> {
  return apiGet<User>(`/api/users/${id}`);
}

export async function updateOwnUser(request: UpdateOwnUserRequest): Promise<User> {
  return apiPut<User, UpdateOwnUserRequest>("/api/users/me", request);
}