import ProductDetail from "@/components/ProductDetail";

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <ProductDetail id={params.id} />
    </main>
  );
}
