import crypto from "node:crypto";
import { env } from "../../config/env";

/** Hash estavel e nao reversivel do id de visitante (localStorage no client) - usado por likes e analytics. */
export function hashVisitor(visitorId: string) {
  return crypto.createHmac("sha256", env.jwtSecret).update(visitorId).digest("hex");
}
