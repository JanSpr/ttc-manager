import { apiGet, apiPut } from "./api";
import type { User } from "../types/user";

export type UpdateOwnEmailRequest = {
  email: string;
};

export async function fetchUsers(): Promise<User[]> {
  return apiGet<User[]>("/api/users");
}

export async function fetchUserById(id: number): Promise<User> {
  return apiGet<User>(`/api/users/${id}`);
}

export async function updateOwnEmail(request: UpdateOwnEmailRequest): Promise<User> {
  return apiPut<User, UpdateOwnEmailRequest>("/api/users/me/email", request);
}