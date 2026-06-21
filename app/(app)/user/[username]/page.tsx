import UserProfileContent from "@/components/app/user-profile-content";
import { getUserProfileByUsername } from "@/lib/server-actions";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const result = await getUserProfileByUsername(username);
  const user = result.profile;

  if (!user) {
    return {
      title: `@${username} | Profile not found`,
      description: `This ${username}'s profile was not found`,
    };
  }

  return {
    title: `@${username} | ${user?.bio || "Profile"}`,
    description: `Check out ${username}'s profile`,
    icons: {
      icon: `${user.avatar}?v=${Date.now()}`,
      shortcut: `${user.avatar}`,
      apple: `${user.avatar}`,
    },
    openGraph: {
      title: `@${username} | ${user?.bio || "Profile"}`,
      description: `Check out ${username}'s profile`,
      url: `/user/${username}`,
      siteName: "OneClq",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${username}'s profile`,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `@${user.username} | OneClq`,
      description: `Check out ${username}'s profile`,
      images: ["/opengraph-image.png"],
    },
    alternates: {
      canonical: `/user/${username}`,
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <UserProfileContent username={username} />;
}
