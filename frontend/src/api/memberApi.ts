import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type { Member, MemberUpsertRequest } from "../types/member";

export async function fetchMembers(): Promise<Member[]> {
  return apiGet("/api/members");
}

export async function fetchMembersAvailableForUser(): Promise<Member[]> {
  return apiGet("/api/members/available-for-user");
}

export async function fetchMemberById(id: number): Promise<Member> {
  return apiGet(`/api/members/${id}`);
}

export async function createMember(
  request: MemberUpsertRequest
): Promise<Member> {
  return apiPost("/api/members", request);
}

export async function updateMember(
  id: number,
  request: MemberUpsertRequest
): Promise<Member> {
  return apiPut(`/api/members/${id}`, request);
}

export async function deleteMember(id: number): Promise<void> {
  return apiDelete(`/api/members/${id}`);
}