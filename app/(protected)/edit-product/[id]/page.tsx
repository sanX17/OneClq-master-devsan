import EditProductContent from "@/components/app/edit-product-content";
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProductContent productId={id} />;
}
