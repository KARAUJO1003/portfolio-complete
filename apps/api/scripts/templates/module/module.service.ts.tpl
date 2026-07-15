import { ApiError } from "../../shared/errors/api-error";
import * as repository from "./{{MODULE}}.repository";
const dto = (item: any) => ({ ...item.toObject(), id: String(item._id), _id: undefined });
export async function list(ownerId: string) { return (await repository.list{{PASCAL}}(ownerId)).map(dto); }
export async function create(ownerId: string, input: unknown) { return dto(await repository.create{{PASCAL}}(ownerId, input)); }
export async function update(ownerId: string, id: string, input: unknown) { const item = await repository.update{{PASCAL}}(ownerId, id, input); if (!item) throw new ApiError("{{PASCAL}} not found", 404); return dto(item); }
export async function remove(ownerId: string, id: string) { if (!await repository.delete{{PASCAL}}(ownerId, id)) throw new ApiError("{{PASCAL}} not found", 404); }
