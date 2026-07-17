import bcrypt from "bcryptjs";
import { ROLE_PERMISSION_PRESETS, type CreateUserRequest, type UpdateUserRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toUserDto } from "./users.mapper";
import * as repository from "./users.repository";

export async function list() {
  const users = await repository.listUsers();
  return users.map(toUserDto);
}

export async function create(input: CreateUserRequest) {
  const existing = await repository.findUserByEmail(input.email);
  if (existing) throw new ApiError("Email ja esta em uso", 409);

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await repository.createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    roles: [input.role],
    permissions: ROLE_PERMISSION_PRESETS[input.role],
    isAdmin: input.role === "owner",
  });

  return toUserDto(user);
}

export async function update(id: string, input: UpdateUserRequest) {
  const patch: Partial<{
    name: string;
    roles: string[];
    permissions: string[];
    isAdmin: boolean;
  }> = {};

  if (input.name) patch.name = input.name;
  if (input.role) {
    patch.roles = [input.role];
    patch.permissions = ROLE_PERMISSION_PRESETS[input.role];
    patch.isAdmin = input.role === "owner";
  }

  const user = await repository.updateUserById(id, patch);
  if (!user) throw new ApiError("User not found", 404);
  return toUserDto(user);
}

export async function remove(id: string, requestingUserId: string) {
  if (id === requestingUserId) {
    throw new ApiError("Voce nao pode excluir a propria conta", 400);
  }

  const user = await repository.findUserById(id);
  if (!user) throw new ApiError("User not found", 404);

  if (user.roles?.includes("owner")) {
    const ownerCount = await repository.countUsersByRole("owner");
    if (ownerCount <= 1) {
      throw new ApiError("Nao e possivel remover o unico owner", 400);
    }
  }

  await repository.deleteUserById(id);
}
