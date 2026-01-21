import { CategoryMenu, Hero, Incentives, Newsletter } from "@/components";
import ProductsSection from "@/components/ProductsSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryMenu />
      <ProductsSection />
    </>
  );
}
