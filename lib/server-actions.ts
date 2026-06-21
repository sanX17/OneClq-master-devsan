import "server-only";
import { getAdminDb } from "./firebase-admin";
import { Product, ShopProduct, UserProfile, WardrobeData } from "./typings";

function getAdminDbOrThrow() {
  const adminDb = getAdminDb();

  if (!adminDb) {
    throw new Error("Firebase Admin credentials are not configured");
  }

  return adminDb;
}

export async function getUserProfileByUsername(username: string) {
  try {
    const adminDb = getAdminDbOrThrow();
    const snapshot = await adminDb
      .collection("users")
      .where("username", "==", username)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        success: true,
        profile: {
          id: doc.id,
          name: data.name || "",
          email: data.email,
          username: data.username,
          avatar: data.avatar,
          bio: data.bio || "",
          createdAt: data.createdAt?.toDate() || new Date(),
        } as UserProfile,
      };
    }

    return { success: false, error: "User not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProductById(productId: string) {
  try {
    const adminDb = getAdminDbOrThrow();
    const snapshot = await adminDb
      .collection("products")
      .where("productId", "==", productId)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        success: true,
        product: {
          productId: doc.id,
          userId: data.userId,
          username: data.username,
          userAvatar: data.userAvatar,
          title: data.title,
          price: data.price || "",
          currency: data.currency || "",
          image: data.image,
          affiliateUrl: data.affiliateUrl,
          platform: data.platform || "",
          postId: data.postId ?? undefined,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as ShopProduct,
      };
    }

    return { success: false, error: "Product not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getWardrobeById(wardrobeId: string) {
  try {
    const adminDb = getAdminDbOrThrow();
    const snapshot = await adminDb
      .collection("wardrobes")
      .where("wardrobeId", "==", wardrobeId)
      .get();

    const products: Product[] = await Promise.all(
      snapshot.docs[0].data().products.map(async (productId: string) => {
        const productSnap = await adminDb
          .collection("products")
          .doc(productId)
          .get();
        const productData = productSnap.data();
        return {
          id: productSnap.id,
          productName: productData?.title,
          productImage: productData?.image,
          productUrl: productData?.affiliateUrl,
        } satisfies Product;
      }),
    ).then((items) => items.filter(Boolean) as Product[]);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        success: true,
        wardrobe: {
          wardrobeId: data.wardrobeId,
          userId: data.userId,
          username: data.username,
          title: data.title,
          description: data.description || "",
          products: products || [],
          shareableLink: data.shareableLink,
          views: data.views || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as WardrobeData,
      };
    }

    return { success: false, error: "Wardrobe not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
