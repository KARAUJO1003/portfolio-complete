import { {{PASCAL}}Model } from "./{{MODULE}}.model";
export const list{{PASCAL}} = (ownerId: string) => {{PASCAL}}Model.find({ ownerId }).sort({ createdAt: -1 });
export const create{{PASCAL}} = (ownerId: string, input: unknown) => {{PASCAL}}Model.create({ ...(input as object), ownerId });
export const update{{PASCAL}} = (ownerId: string, id: string, input: unknown) => {{PASCAL}}Model.findOneAndUpdate({ _id: id, ownerId }, { $set: input }, { new: true });
export const delete{{PASCAL}} = (ownerId: string, id: string) => {{PASCAL}}Model.findOneAndDelete({ _id: id, ownerId });
