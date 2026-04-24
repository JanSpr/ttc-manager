import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type { User, UserUpsertRequest } from "../types/user";

export type UpdateOwnUserRequest = {
  email: string;
  password?: string;
};

export async function fetchUsers(): Promise<User[]> {
  return apiGet("/api/users");
}

export async function fetchUserById(id: number): Promise<User> {
  return apiGet(`/api/users/${id}`);
}

export async function createUser(request: UserUpsertRequest): Promise<User> {
  return apiPost("/api/users", request);
}

export async function updateUser(
  id: number,
  request: UserUpsertRequest
): Promise<User> {
  return apiPut(`/api/users/${id}`, request);
}

export async function deleteUser(id: number): Promise<void> {
  return apiDelete(`/api/users/${id}`);
}

export async function updateOwnUser(
  request: UpdateOwnUserRequest
): Promise<User> {
  return apiPut("/api/users/me", request);
}