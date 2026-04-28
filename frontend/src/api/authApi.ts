import { apiGet, apiPost } from "./api";
import type { AuthResponse, LoginRequest } from "../types/auth";
import type { User } from "../types/user";

export type ActivateUserAccountRequest = {
  activationCode: string;
  password: string;
  email?: string | null;
};

export type ActivationPreviewResponse = {
  username: string;
  fullName: string;
};

export function login(request: LoginRequest) {
  return apiPost<AuthResponse, LoginRequest>("/api/auth/login", request);
}

export function logout() {
  return apiPost<AuthResponse>("/api/auth/logout");
}

export function fetchCurrentUser() {
  return apiGet<AuthResponse>("/api/auth/me");
}

export function fetchActivationPreview(activationCode: string) {
  return apiGet<ActivationPreviewResponse>(
    `/api/auth/activation-preview?activationCode=${encodeURIComponent(
      activationCode,
    )}`,
  );
}

export function activateUserAccount(request: ActivateUserAccountRequest) {
  return apiPost<User, ActivateUserAccountRequest>("/api/auth/activate", request);
}