import { PageVisitModel } from "./page-visit.model";
import type { DeviceType } from "./device-type";

export async function createVisit(data: {
  deviceType: DeviceType;
  path: string;
  referrerHost: string;
  visitorHash: string;
}) {
  return PageVisitModel.create(data);
}

export async function countDistinctVisitorsSince(since: Date) {
  const result = await PageVisitModel.distinct("visitorHash", { createdAt: { $gte: since } });
  return result.length;
}

export async function countByDeviceSince(since: Date) {
  return PageVisitModel.aggregate<{ _id: string; count: number }>([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: "$deviceType", count: { $sum: 1 } } },
  ]);
}

export async function countByReferrerSince(since: Date, limit: number) {
  return PageVisitModel.aggregate<{ _id: string; count: number }>([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: "$referrerHost", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
}

export async function countByDaySince(since: Date) {
  return PageVisitModel.aggregate<{ _id: string; count: number }>([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
}
