import ProductDetail from "@/components/pages/products/ProductDetail";

export default function ProductDetailPage({ params }) {
  return <ProductDetail productSlug={params.slug} />;
}
