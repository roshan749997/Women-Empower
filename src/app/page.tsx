import ImageSlider from "./component/product/ImageSlider";
import { TopCategories } from "./component/product/TopCategories";
import { BestSellers } from "./component/product/BestSellers";
import { TrendingProducts } from "./component/product/TrandingProduct";
import ProductShowcase from "./component/product/ProductShowcase";
import ReviewContainer from "./component/product/ReviewContainer";
import CraftGiftHero from "./component/product/CraftGiftHero";
import { TopRatedArtists } from "./component/product/TopRatedArtists";
import { PopularCourses } from "./component/product/PopularCourses";


export default function Home() {
  return (
    <div>
      <ImageSlider />
      <TopCategories />
      <BestSellers />
      <TopRatedArtists />
      <TrendingProducts />
      <PopularCourses />
      <ProductShowcase />
      <ReviewContainer />
      <CraftGiftHero />
    </div>
  );
}
