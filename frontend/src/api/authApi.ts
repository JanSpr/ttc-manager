import { apiGet, apiPost } from "./api";
import type { AuthResponse, LoginRequest } from "../types/auth";

export function login(request: LoginRequest) {
  return apiPost<AuthResponse, LoginRequest>("/api/auth/login", request);
}

export function logout() {
  return apiPost<AuthResponse>("/api/auth/logout");
}

export function fetchCurrentUser() {
  return apiGet<AuthResponse>("/api/auth/me");
}