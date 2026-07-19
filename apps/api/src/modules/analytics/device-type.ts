export type DeviceType = "desktop" | "mobile" | "tablet";

/** Deteccao simples via regex no User-Agent - sem lib nova, cobre os casos comuns. */
export function detectDeviceType(userAgent: string): DeviceType {
  const ua = (userAgent || "").toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|windows phone/.test(ua)) return "mobile";
  return "desktop";
}
