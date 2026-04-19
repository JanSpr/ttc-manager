import { apiGet } from "./api";
import type { Member } from "../types/member";

export async function fetchMembers(): Promise<Member[]> {
  return apiGet<Member[]>("/api/members");
}

export async function fetchMemberById(id: number): Promise<Member> {
  return apiGet<Member>(`/api/members/${id}`);
}
