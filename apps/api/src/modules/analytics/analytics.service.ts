import { hashVisitor } from "../../shared/security/visitor-hash";
import * as repository from "./analytics.repository";
import { detectDeviceType } from "./device-type";

const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const BREAKDOWN_WINDOW_DAYS = 30;
const DAILY_WINDOW_DAYS = 14;
const REFERRER_LIMIT = 6;

const deviceLabels: Record<string, string> = {
  desktop: "Desktop",
  mobile: "Celular",
  tablet: "Tablet",
};

export async function trackVisit(input: {
  path: string;
  referrer?: string;
  requestHost: string;
  userAgent: string;
  visitorId: string;
}) {
  if (!input.visitorId || input.visitorId.length < 12) return;

  const visitorHash = hashVisitor(input.visitorId);
  const deviceType = detectDeviceType(input.userAgent);
  const referrerHost = extractReferrerHost(input.referrer, input.requestHost);

  await repository.createVisit({
    deviceType,
    path: input.path.slice(0, 200),
    referrerHost,
    visitorHash,
  });
}

/**
 * "Ativos agora" = visitantes distintos com pelo menos uma visita/heartbeat
 * nos ultimos 5 minutos - sem sessao persistente/websocket, e o sinal real
 * mais proximo de presenca ao vivo que da pra ter so com beacons periodicos.
 */
export async function getOverview() {
  const now = new Date();
  const activeSince = new Date(now.getTime() - ACTIVE_WINDOW_MS);
  const breakdownSince = new Date(now.getTime() - BREAKDOWN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const dailySince = new Date(now.getTime() - DAILY_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [activeNow, deviceRows, referrerRows, dailyRows] = await Promise.all([
    repository.countDistinctVisitorsSince(activeSince),
    repository.countByDeviceSince(breakdownSince),
    repository.countByReferrerSince(breakdownSince, REFERRER_LIMIT),
    repository.countByDaySince(dailySince),
  ]);

  const deviceBreakdown = ["desktop", "mobile", "tablet"]
    .map((type) => ({
      label: deviceLabels[type],
      value: deviceRows.find((row) => row._id === type)?.count ?? 0,
    }))
    .filter((item) => item.value > 0);

  const referrerBreakdown = referrerRows.map((row) => ({
    label: row._id || "Direto",
    value: row.count,
  }));

  const dailyMap = new Map(dailyRows.map((row) => [row._id, row.count]));
  const dailyVisits = Array.from({ length: DAILY_WINDOW_DAYS }, (_, index) => {
    const date = new Date(dailySince.getTime() + index * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    return { date: key, value: dailyMap.get(key) ?? 0 };
  });

  return { activeNow, dailyVisits, deviceBreakdown, referrerBreakdown };
}

function extractReferrerHost(referrer: string | undefined, requestHost: string) {
  if (!referrer) return "Direto";

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace(/^www\./, "");
    if (hostname === requestHost.replace(/^www\./, "")) return "Direto";
    return hostname;
  } catch {
    return "Direto";
  }
}
