import { UserModel, type UserDocument } from "./user.model";

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string) {
  return UserModel.findById(id);
}

export async function updateUserById(
  id: string,
  data: Partial<{
    name: string;
    roles: string[];
    permissions: string[];
    isAdmin: boolean;
  }>,
) {
  return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  roles?: string[];
  permissions?: string[];
  isAdmin?: boolean;
}) {
  return UserModel.create({
    ...data,
    email: data.email.toLowerCase(),
  }) as Promise<UserDocument>;
}
