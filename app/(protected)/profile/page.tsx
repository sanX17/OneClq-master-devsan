import ProfileContent from "@/components/app/profile-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
