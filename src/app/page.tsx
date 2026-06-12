import { fetchPortfolioData } from "@/lib/cms/fetch";
import { serializePortfolioData } from "@/lib/cms/serialize";
import { PortfolioClient } from "@/components/PortfolioClient";

export default async function Home() {
  const data = serializePortfolioData(await fetchPortfolioData());
  return <PortfolioClient data={data} />;
}
