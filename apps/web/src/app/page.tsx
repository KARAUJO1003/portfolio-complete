import { PortfolioHome } from "@/features/portfolio/components/portfolio-home";
import { getPublicPortfolio } from "@/features/portfolio/api/public-portfolio-api";

export default async function HomePage() {
  try {
    const portfolio = await getPublicPortfolio();
    return <PortfolioHome portfolio={portfolio} />;
  } catch {
    return <PortfolioHome portfolio={null} />;
  }
}
