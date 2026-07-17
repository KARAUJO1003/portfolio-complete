import type { CreateUserRequest, UpdateUserRequest, UserDto } from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function listUsers() {
  const response = await api.get<{ users: UserDto[] }>("/users");
  return response.data.users;
}

export async function createUser(input: CreateUserRequest) {
  const response = await api.post<{ user: UserDto }>("/users", input);
  return response.data.user;
}

export async function updateUser(id: string, input: UpdateUserRequest) {
  const response = await api.put<{ user: UserDto }>(`/users/${id}`, input);
  return response.data.user;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}
