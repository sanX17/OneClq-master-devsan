import { Metadata } from "next";
import { getWardrobeById } from "@/lib/server-actions";
import WardrobeContent from "@/components/app/wardrobe-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getWardrobeById(id);
  const wardrobe = result.wardrobe;

  if (!wardrobe) {
    return {
      title: "Wardrobe not found",
      description: "This wardrobe was not found",
    };
  }

  return {
    title: `Check out ${wardrobe.title}`,
    description: `Check out this wardrobe: ${wardrobe.title}`,
    openGraph: {
      title: `Check out ${wardrobe.title}`,
      description: `Check out this wardrobe: ${wardrobe.title}`,
      url: `/wardrobe/${id}`,
      siteName: "OneClq",
      images: [
        {
          url: wardrobe.products[0]?.productImage || "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: wardrobe.title,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `Check out ${wardrobe.title} | OneClq`,
      description: `Check out this wardrobe: ${wardrobe.title}`,
      images: [wardrobe.products[0]?.productImage || "/opengraph-image.png"],
    },
    alternates: {
      canonical: `/wardrobe/${id}`,
    },
  };
}

export default async function WardrobeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <WardrobeContent wardrobeId={id} />;
}
