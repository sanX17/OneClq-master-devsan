"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getUserProfile, updateUserProfile } from "@/lib/firebase-actions";
import { toast } from "sonner";
import BackButton from "@/components/app/back-button";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const result = await getUserProfile(user.uid);
      if (result.success) {
        setUsername(result.profile?.username!);
        setBio(result.profile?.bio || "");
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      toast.error("Username cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const result = await updateUserProfile(user!.uid, username, bio);
      if (result.success) {
        toast.success("Profile updated successfully");
        router.push("/profile");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl lg:mx-auto mx-5 pt-6 pb-10 lg:pt-10">
      <BackButton />

      <Card className="p-8">
        <h1 className="text-3xl font-semibold mb-8">Edit Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <Input
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={saving}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none h-24"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
