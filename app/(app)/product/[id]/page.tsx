import ProductDetailContent from "@/components/app/product-detail-content";
import { getProductById } from "@/lib/server-actions";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getProductById(id);
  const product = result.product;

  if (!product) {
    return {
      title: "Product not found",
      description: "This product was not found",
    };
  }

  return {
    title: `Buy ${product.title}`,
    description: `Check out this product: ${product.title}`,
    openGraph: {
      title: `Buy ${product.title}`,
      description: `Check out this product: ${product.title}`,
      url: `/product/${id}`,
      siteName: "OneClq",
      images: [
        {
          url: product.image || "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `Buy ${product.title} | OneClq`,
      description: `Check out this product: ${product.title}`,
      images: [product.image || "/opengraph-image.png"],
    },
    alternates: {
      canonical: `/product/${id}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailContent productId={id} />;
}
