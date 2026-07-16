import { PortfolioHome } from "@/features/portfolio/components/portfolio-home";
import { getPublicPortfolio } from "@/features/portfolio/api/public-portfolio-api";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  noStore();

  try {
    const portfolio = await getPublicPortfolio();
    return <PortfolioHome portfolio={portfolio} />;
  } catch {
    return <PortfolioHome portfolio={null} />;
  }
}
