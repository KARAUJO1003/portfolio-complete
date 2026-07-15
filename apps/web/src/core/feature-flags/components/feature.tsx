import { isFeatureEnabled } from "@/core/feature-flags/is-feature-enabled";

type FeatureProps = {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Feature({ flag, children, fallback = null }: FeatureProps) {
  return isFeatureEnabled(flag) ? <>{children}</> : <>{fallback}</>;
}
