import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  Timestamp,
  setDoc,
  DocumentData,
  QueryDocumentSnapshot,
  startAfter,
  limit,
} from "firebase/firestore";
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
import {
  getFirebaseAuth,
  getFirestoreDb,
  // getFirebaseStorage,
} from "./firebase";
import {
  Post,
  PostData,
  Product,
  ShopProduct,
  UserProfile,
  WardrobeData,
} from "./typings";

const PLACEHOLDER_IMAGE = "/placeholder.svg?height=300&width=300";

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(getFirebaseAuth(), provider);
    const user = userCredential.user;

    // Check if user profile already exists
    const usersRef = collection(getFirestoreDb(), "users");
    const existingQuery = query(usersRef, where("uid", "==", user.uid));
    const existingSnapshot = await getDocs(existingQuery);

    if (existingSnapshot.empty) {
      // New user - create profile from Google account data
      // Generate a unique username from display name
      const baseUsername = (user.displayName ?? user.email ?? "user")
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      // Ensure username uniqueness by appending random suffix if taken
      let username = baseUsername;
      const usernameQuery = query(usersRef, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
        username = `${baseUsername}_${Math.random().toString(36).slice(2, 6)}`;
      }

      await addDoc(usersRef, {
        uid: user.uid,
        name: user.displayName ?? "",
        email: user.email,
        username,
        avatar:
          user.photoURL ??
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: "",
        createdAt: Timestamp.now(),
      });
    } else {
      // Existing user - sync avatar if Google photo changed
      const existingDoc = existingSnapshot.docs[0];
      const existingData = existingDoc.data();
      if (user.photoURL && existingData.avatar !== user.photoURL) {
        await updateDoc(doc(getFirestoreDb(), "users", existingDoc.id), {
          avatar: user.photoURL,
        });
      }
      if (user.displayName && existingData.name !== user.displayName) {
        await updateDoc(doc(getFirestoreDb(), "users", existingDoc.id), {
          name: user.displayName ?? "",
        });
      }
    }

    return { success: true, user };
  } catch (error: any) {
    // user closed the popup - don't treat as hard error
    if (error.code === "auth/popup-closed-by-user") {
      return { success: false, error: "Sign-in cancelled" };
    }
    return { success: false, error: error.message };
  }
}

// Auth Actions
export async function registerUser(
  email: string,
  password: string,
  username: string,
) {
  try {
    // Check if username already exists
    const usersRef = collection(getFirestoreDb(), "users");
    const usernameQuery = query(usersRef, where("username", "==", username));
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      return { success: false, error: "Username is already taken" };
    }

    const userCredential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      password,
    );
    const user = userCredential.user;

    await addDoc(collection(getFirestoreDb(), "users"), {
      uid: user.uid,
      email: user.email,
      username: username.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: "",
      createdAt: Timestamp.now(),
    });

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      password,
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(getFirebaseAuth());
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      if (user) {
        const userDoc = await getDocs(
          query(
            collection(getFirestoreDb(), "users"),
            where("uid", "==", user.uid),
          ),
        );
        if (!userDoc.empty) {
          resolve({ ...user, profile: userDoc.docs[0].data() });
        } else {
          resolve(user);
        }
      } else {
        resolve(null);
      }
      unsubscribe();
    });
  });
}

// Post Actions
// export async function createPost(
//   userId: string,
//   username: string,
//   userAvatar: string,
//   imageFile: File,
//   products: Product[],
//   caption?: string,
//   tags: string[] = [],
// ) {
//   try {
//     const fileName = `posts/${userId}/${Date.now()}-${imageFile.name}`;
//     const storageRef = ref(getFirebaseStorage(), fileName);
//     const snapshot = await uploadBytes(storageRef, imageFile);
//     const imageUrl = await getDownloadURL(snapshot.ref);

//     // Scrape product images server-side before saving
//     const productsWithImages = await Promise.all(
//       products.map(async (product) => {
//         try {
//           const res = await fetch("/api/image", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ url: product.productUrl }),
//           });
//           const { imageUrl: productImage } = await res.json();
//           return { ...product, productImage };
//         } catch {
//           return {
//             ...product,
//             productImage: "/placeholder.svg?height=300&width=300",
//           };
//         }
//       }),
//     );

//     const docRef = await addDoc(collection(getFirestoreDb(), "posts"), {
//       userId,
//       username,
//       userAvatar,
//       imageUrl,
//       products: productsWithImages,
//       likes: 0,
//       saves: 0,
//       caption: caption || "",
//       tags,
//       createdAt: Timestamp.now(),
//     });

//     return { success: true, postId: docRef.id };
//   } catch (error: any) {
//     return { success: false, error: error.message };
//   }
// }

export async function createPost(
  userId: string,
  username: string,
  userAvatar: string,
  imageFile: File,
  products: Product[],
  caption?: string,
  tags: string[] = [],
) {
  try {
    const db = getFirestoreDb();
    const imageUrl = await uploadToS3(imageFile, `posts/${userId}`);

    type Enriched = Product & {
      scrapedTitle: string;
      price: string;
      currency: string;
      platform: string;
    };

    const scrapedProducts: Enriched[] = await Promise.all(
      products.map(async (product) => {
        try {
          const scraperUrl = new URL("/api/image", window.location.origin);
          scraperUrl.searchParams.set("q", product.productUrl);
          const res = await fetch(scraperUrl.toString());
          const result = await res.json();
          const data = result;
          return {
            ...product,
            productImage: data.image_url || PLACEHOLDER_IMAGE,
            scrapedTitle: product.productName || data.product_title,
            price: data.price || "",
            currency: data.currency || "",
            platform: data.platform || "",
          };
        } catch {
          return {
            ...product,
            productImage: PLACEHOLDER_IMAGE,
            scrapedTitle: product.productName,
            price: "",
            currency: "",
            platform: "",
          };
        }
      }),
    );

    // Create products
    const productRefs = await Promise.all(
      scrapedProducts.map((p) =>
        addDoc(collection(db, "products"), {
          productId: p.id,
          userId,
          username,
          userAvatar,
          title: p.scrapedTitle || p.productName,
          price: p.price,
          currency: p.currency,
          image: p.productImage,
          affiliateUrl: p.productUrl,
          platform: p.platform,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }),
      ),
    );

    const productIds = productRefs.map((ref) => ref.id);

    const docRef = await addDoc(collection(getFirestoreDb(), "posts"), {
      userId,
      username,
      userAvatar,
      imageUrl,
      products: productIds,
      likes: 0,
      saves: 0,
      caption: caption || "",
      tags,
      createdAt: Timestamp.now(),
    });

    return { success: true, postId: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPosts() {
  try {
    const q = query(
      collection(getFirestoreDb(), "posts"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const posts: Post[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        username: data.username,
        userAvatar: data.userAvatar,
        imageUrl: data.imageUrl,
        products: data.products || [],
        likes: data.likes || 0,
        saves: data.saves || 0,
        caption: data.caption || "",
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });

    return { success: true, posts };
  } catch (error: any) {
    return { success: false, error: error.message, posts: [] };
  }
}

export async function getPostById(postId: string) {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      const products: Product[] = await Promise.all(
        data.products.map(async (productId: string) => {
          const productSnap = await getDoc(doc(db, "products", productId));

          if (!productSnap.exists()) {
            return null;
          }

          const productData = productSnap.data();

          return {
            id: productSnap.id,
            productName: productData.title,
            productUrl: productData.affiliateUrl,
            productImage: productData.image,
          } satisfies Product;
        }),
      ).then((items) => items.filter(Boolean) as Product[]);

      return {
        success: true,
        post: {
          id: docSnap.id,
          userId: data.userId,
          username: data.username,
          userAvatar: data.userAvatar,
          imageUrl: data.imageUrl,
          products: products || [],
          likes: data.likes || 0,
          saves: data.saves || 0,
          caption: data.caption || "",
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate() || new Date(),
        } as PostData,
      };
    }
    return { success: false, error: "Post not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePost(
  postId: string,
  products: Product[],
  caption?: string,
  tags: string[] = [],
) {
  try {
    const docRef = doc(getFirestoreDb(), "posts", postId);
    await updateDoc(docRef, {
      products,
      caption: caption || "",
      tags,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// export async function deletePost(postId: string, imageUrl: string) {
//   try {
//     // Delete image from Storage
//     const imageRef = ref(getFirebaseStorage(), imageUrl);
//     await deleteObject(imageRef).catch(() => {
//       // Image might already be deleted
//     });

//     // Delete post document
//     const docRef = doc(getFirestoreDb(), "posts", postId);
//     await deleteDoc(docRef);

//     return { success: true };
//   } catch (error: any) {
//     return { success: false, error: error.message };
//   }
// }

export async function deletePost(postId: string, imageUrl: string) {
  try {
    const key = new URL(imageUrl).pathname.slice(1);
    await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    // Also remove mirrored products from the products collection
    const pq = query(
      collection(getFirestoreDb(), "products"),
      where("postId", "==", postId),
    );
    const pSnap = await getDocs(pq);
    await Promise.all(pSnap.docs.map((d) => deleteDoc(d.ref)));

    await deleteDoc(doc(getFirestoreDb(), "posts", postId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserPosts(userId: string) {
  try {
    const q = query(
      collection(getFirestoreDb(), "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const posts: Post[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        username: data.username,
        userAvatar: data.userAvatar,
        imageUrl: data.imageUrl,
        products: data.products || [],
        likes: data.likes || 0,
        saves: data.saves || 0,
        caption: data.caption || "",
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });

    return { success: true, posts };
  } catch (error: any) {
    return { success: false, error: error.message, posts: [] };
  }
}

// Wardrobe Actions
export async function createWardrobe(
  userId: string,
  username: string,
  userAvatar: string,
  title: string,
  products: Product[],
  description?: string,
) {
  try {
    const db = getFirestoreDb();
    const shareableLink = `wardrobe-${Math.random().toString(36).substr(2, 9)}`;

    // Scrape product images server-side before saving
    type Enriched = Product & {
      scrapedTitle: string;
      price: string;
      currency: string;
      platform: string;
    };

    const scrapedProducts: Enriched[] = await Promise.all(
      products.map(async (product) => {
        try {
          const scraperUrl = new URL("/api/image", window.location.origin);
          scraperUrl.searchParams.set("q", product.productUrl);
          const res = await fetch(scraperUrl.toString());
          const result = await res.json();
          const data = result.data || result;
          return {
            ...product,
            productImage: data.image_url || PLACEHOLDER_IMAGE,
            scrapedTitle: product.productName || data.product_title,
            price: data.price || "",
            currency: data.currency || "",
            platform: data.platform || "",
          };
        } catch {
          return {
            ...product,
            productImage: PLACEHOLDER_IMAGE,
            scrapedTitle: product.productName,
            price: "",
            currency: "",
            platform: "",
          };
        }
      }),
    );

    // Create products
    const productRefs = await Promise.all(
      scrapedProducts.map((p) =>
        addDoc(collection(db, "products"), {
          productId: p.id,
          userId,
          username,
          userAvatar,
          title: p.scrapedTitle || p.productName,
          price: p.price,
          currency: p.currency,
          image: p.productImage,
          affiliateUrl: p.productUrl,
          platform: p.platform,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }),
      ),
    );

    const productIds = productRefs.map((ref) => ref.id);

    const docRef = doc(collection(db, "wardrobes"));
    const wardrobeId = docRef.id;

    await setDoc(docRef, {
      wardrobeId,
      userId,
      username,
      title,
      description: description || "",
      products: productIds,
      shareableLink,
      views: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { success: true, wardrobeId: docRef.id, shareableLink };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getWardrobes() {
  try {
    const db = getFirestoreDb();
    const q = query(collection(db, "wardrobes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const wardrobes: WardrobeData[] = await Promise.all(
      querySnapshot.docs.map(async (wardrobeDoc) => {
        const data = wardrobeDoc.data();

        const productIds: string[] = data.products || [];

        const products: Product[] = await Promise.all(
          productIds.map(async (productId: string) => {
            const productSnap = await getDoc(doc(db, "products", productId));

            if (!productSnap.exists()) {
              return null;
            }

            const productData = productSnap.data();

            return {
              id: productSnap.id,
              productName: productData.title || "",
              productUrl: productData.affiliateUrl || "",
              productImage: productData.image || "",
            } satisfies Product;
          }),
        ).then((items) => items.filter(Boolean) as Product[]);

        return {
          wardrobeId: data.wardrobeId,
          userId: data.userId,
          username: data.username,
          title: data.title,
          description: data.description || "",
          products,
          shareableLink: data.shareableLink,
          views: data.views || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }),
    );

    return { success: true, wardrobes };
  } catch (error: any) {
    return { success: false, error: error.message, wardrobes: [] };
  }
}

export async function getWardrobeById(wardrobeId: string) {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, "wardrobes", wardrobeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      const products: Product[] = await Promise.all(
        data.products.map(async (productId: string) => {
          const productSnap = await getDoc(doc(db, "products", productId));

          if (!productSnap.exists()) {
            return null;
          }

          const productData = productSnap.data();

          return {
            id: productSnap.id,
            productName: productData.title,
            productUrl: productData.affiliateUrl,
            productImage: productData.image,
          } satisfies Product;
        }),
      ).then((items) => items.filter(Boolean) as Product[]);

      // Increment views
      // if (docSnap.data().userId !== userId) {
      await updateDoc(docRef, {
        views: increment(1),
      });
      // }

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

export async function getWardrobeByLink(shareableLink: string) {
  try {
    const q = query(
      collection(getFirestoreDb(), "wardrobes"),
      where("shareableLink", "==", shareableLink),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();

      // Increment views
      // if (docSnap.data().userId !== userId) {
      await updateDoc(doc(getFirestoreDb(), "wardrobes", docSnap.id), {
        views: increment(1),
      });
      // }

      return {
        success: true,
        wardrobe: {
          id: docSnap.id,
          userId: data.userId,
          username: data.username,
          title: data.title,
          description: data.description || "",
          products: data.products || [],
          shareableLink: data.shareableLink,
          views: data.views || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        },
      };
    }
    return { success: false, error: "Wardrobe not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWardrobe(
  wardrobeId: string,
  title: string,
  products: Product[],
  description?: string,
) {
  try {
    const docRef = doc(getFirestoreDb(), "wardrobes", wardrobeId);
    await updateDoc(docRef, {
      title,
      description: description || "",
      products,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWardrobe(wardrobeId: string) {
  try {
    const docRef = doc(getFirestoreDb(), "wardrobes", wardrobeId);

    // Also remove mirrored products from the products collection
    const pq = query(
      collection(getFirestoreDb(), "products"),
      where("postId", "==", wardrobeId),
    );
    const pSnap = await getDocs(pq);
    await Promise.all(pSnap.docs.map((d) => deleteDoc(d.ref)));

    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserWardrobes(userId: string) {
  try {
    const db = getFirestoreDb();
    const q = query(
      collection(db, "wardrobes"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const wardrobes: WardrobeData[] = await Promise.all(
      querySnapshot.docs.map(async (wardrobeDoc) => {
        const data = wardrobeDoc.data();

        const productIds: string[] = data.products || [];

        const products: Product[] = await Promise.all(
          productIds.map(async (productId: string) => {
            const productSnap = await getDoc(doc(db, "products", productId));

            if (!productSnap.exists()) {
              return null;
            }

            const productData = productSnap.data();

            return {
              id: productSnap.id,
              productName: productData.title || "",
              productUrl: productData.affiliateUrl || "",
              productImage: productData.image || "",
            } satisfies Product;
          }),
        ).then((items) => items.filter(Boolean) as Product[]);

        return {
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
        };
      }),
    );

    return { success: true, wardrobes };
  } catch (error: any) {
    return { success: false, error: error.message, wardrobes: [] };
  }
}

// User Profile Actions
export async function getUserProfile(userId: string) {
  try {
    const q = query(
      collection(getFirestoreDb(), "users"),
      where("uid", "==", userId),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
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

export async function updateUserProfile(
  userId: string,
  username: string,
  bio?: string,
) {
  try {
    // Check if username already exists
    const usersRef = collection(getFirestoreDb(), "users");
    const usernameQuery = query(
      usersRef,
      where("username", "==", username.toLocaleLowerCase()),
    );
    const usernameSnapshot = await getDocs(usernameQuery);

    if (
      !usernameSnapshot.empty &&
      usernameSnapshot.docs[0].data().uid !== userId
    ) {
      return { success: false, error: "Username is already taken" };
    }

    const q = query(
      collection(getFirestoreDb(), "users"),
      where("uid", "==", userId),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(getFirestoreDb(), "users", querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        username: username.toLowerCase(),
        bio: bio || "",
      });
      return { success: true };
    }
    return { success: false, error: "User not found" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Save Actions
export async function toggleSavePost(userId: string, postId: string) {
  try {
    const savesRef = collection(getFirestoreDb(), "saves");
    const q = query(
      savesRef,
      where("userId", "==", userId),
      where("postId", "==", postId),
    );
    const snapshot = await getDocs(q);

    const postRef = doc(getFirestoreDb(), "posts", postId);

    if (!snapshot.empty) {
      // Already saved - unsave
      await deleteDoc(snapshot.docs[0].ref);
      await updateDoc(postRef, { saves: increment(-1) });
      return { success: true, saved: false };
    } else {
      // Not saved - save
      await addDoc(savesRef, {
        userId,
        postId,
        createdAt: Timestamp.now(),
      });
      await updateDoc(postRef, { saves: increment(1) });
      return { success: true, saved: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function isPostSaved(userId: string, postId: string) {
  try {
    const q = query(
      collection(getFirestoreDb(), "saves"),
      where("userId", "==", userId),
      where("postId", "==", postId),
    );
    const snapshot = await getDocs(q);
    return { success: true, saved: !snapshot.empty };
  } catch (error: any) {
    return { success: false, saved: false };
  }
}

export async function getUserSavedPosts(
  userId: string,
  pageSize = 5,
  cursor?: QueryDocumentSnapshot<DocumentData>,
) {
  try {
    const db = getFirestoreDb();

    const savesQuery = cursor
      ? query(
          collection(db, "saves"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(cursor),
          limit(pageSize),
        )
      : query(
          collection(db, "saves"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize),
        );

    const savesSnapshot = await getDocs(savesQuery);

    if (savesSnapshot.empty) {
      return {
        success: true,
        posts: [] as Post[],
        lastDoc: null,
        hasMore: false,
      };
    }

    const postIds = savesSnapshot.docs.map((d) => d.data().postId);

    const chunks: string[][] = [];
    for (let i = 0; i < postIds.length; i += 30) {
      chunks.push(postIds.slice(i, i + 30));
    }

    const postDocs = (
      await Promise.all(
        chunks.map((chunk) =>
          getDocs(
            query(collection(db, "posts"), where("__name__", "in", chunk)),
          ),
        ),
      )
    ).flatMap((s) => s.docs);

    const postMap = new Map(postDocs.map((d) => [d.id, d]));

    const posts: Post[] = postIds
      .filter((id) => postMap.has(id))
      .map((id) => {
        const d = postMap.get(id)!;
        const data = d.data();

        return {
          id: d.id,
          userId: data.userId,
          username: data.username,
          userAvatar: data.userAvatar,
          imageUrl: data.imageUrl,
          products: data.products || [],
          likes: data.likes || 0,
          saves: data.saves || 0,
          caption: data.caption || "",
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });

    return {
      success: true,
      posts,
      lastDoc: savesSnapshot.docs[savesSnapshot.docs.length - 1],
      hasMore: savesSnapshot.docs.length === pageSize,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      posts: [] as Post[],
      lastDoc: null,
      hasMore: false,
    };
  }
}

export async function getPublicUserProfile(username: string) {
  try {
    const db = getFirestoreDb();
    const q = query(
      collection(getFirestoreDb(), "users"),
      where("username", "==", username.toLowerCase()),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return { success: false, error: "User not found" };

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    const [postsResult, wardrobesResult, productsResult] = await Promise.all([
      getDocs(
        query(
          collection(db, "posts"),
          where("userId", "==", data.uid),
          orderBy("createdAt", "desc"),
        ),
      ),
      getDocs(
        query(
          collection(db, "wardrobes"),
          where("userId", "==", data.uid),
          orderBy("createdAt", "desc"),
        ),
      ),
      getDocs(
        query(
          collection(db, "products"),
          where("userId", "==", data.uid),
          orderBy("createdAt", "desc"),
        ),
      ),
    ]);

    const posts: Post[] = postsResult.docs.map((d) => {
      const p = d.data();
      return {
        id: d.id,
        userId: p.userId,
        username: p.username,
        userAvatar: p.userAvatar,
        imageUrl: p.imageUrl,
        products: p.products || [],
        likes: p.likes || 0,
        saves: p.saves || 0,
        caption: p.caption || "",
        createdAt: p.createdAt?.toDate() || new Date(),
      };
    });

    const wardrobes: WardrobeData[] = await Promise.all(
      wardrobesResult.docs.map(async (wardrobeDoc) => {
        const data = wardrobeDoc.data();

        const productIds: string[] = data.products || [];

        const products: Product[] = await Promise.all(
          productIds.map(async (productId: string) => {
            const productSnap = await getDoc(doc(db, "products", productId));

            if (!productSnap.exists()) {
              return null;
            }

            const productData = productSnap.data();

            return {
              id: productSnap.id,
              productName: productData.title || "",
              productUrl: productData.affiliateUrl || "",
              productImage: productData.image || "",
            } satisfies Product;
          }),
        ).then((items) => items.filter(Boolean) as Product[]);

        return {
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
        };
      }),
    );

    const products: ShopProduct[] = productsResult.docs.map((d) => {
      const p = d.data();
      return {
        productId: d.id,
        userId: p.userId,
        username: p.username,
        userAvatar: p.userAvatar,
        title: p.title,
        price: p.price || "",
        currency: p.currency || "",
        image: p.image,
        affiliateUrl: p.affiliateUrl,
        platform: p.platform || "",
        postId: p.postId ?? undefined,
        createdAt: p.createdAt?.toDate() || new Date(),
        updatedAt: p.updatedAt?.toDate() || new Date(),
      };
    });

    return {
      success: true,
      profile: {
        id: docSnap.id,
        uid: data.uid,
        email: data.email,
        username: data.username,
        avatar: data.avatar,
        bio: data.bio || "",
        createdAt: data.createdAt?.toDate() || new Date(),
      },
      posts,
      wardrobes,
      products,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// AWS S3
async function uploadToS3(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload image");

  const { url } = await res.json();
  return url;
}

// Helper to extract S3 key from URL
function extractS3Key(url: string): string {
  const bucketBase = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.`;
  // Strip the full domain prefix to get just the key
  const urlObj = new URL(url);
  return urlObj.pathname.slice(1); // remove leading "/"
}

// Product Actions

export async function createProduct(
  userId: string,
  username: string,
  userAvatar: string,
  affiliateUrl: string,
  productUrl: string,
  scraped: {
    title: string;
    image: string;
    price: string;
    currency: string;
    platform: string;
  },
) {
  try {
    const db = getFirestoreDb();

    const productRef = doc(collection(db, "products"));
    const productId = productRef.id;

    await setDoc(productRef, {
      productId,
      userId,
      username,
      userAvatar,
      title: scraped.title,
      price: scraped.price || "",
      currency: scraped.currency || "",
      image: scraped.image,
      affiliateUrl,
      productUrl,
      platform: scraped.platform || "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      productId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getProducts() {
  try {
    const q = query(
      collection(getFirestoreDb(), "products"),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    const products: ShopProduct[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        productId: d.id,
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
      };
    });
    return { success: true, products };
  } catch (error: any) {
    return { success: false, error: error.message, products: [] };
  }
}

export async function getProductById(productId: string) {
  try {
    const docSnap = await getDoc(doc(getFirestoreDb(), "products", productId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        success: true,
        product: {
          productId: docSnap.id,
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

export async function updateProduct(
  productId: string,
  updates: Partial<
    Pick<
      ShopProduct,
      "title" | "affiliateUrl" | "image" | "price" | "currency" | "platform"
    >
  >,
) {
  try {
    await updateDoc(doc(getFirestoreDb(), "products", productId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await deleteDoc(doc(getFirestoreDb(), "products", productId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserProducts(userId: string) {
  try {
    const q = query(
      collection(getFirestoreDb(), "products"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    const products: ShopProduct[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        productId: d.id,
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
      };
    });
    return { success: true, products };
  } catch (error: any) {
    console.log("Error: ", error);
    return { success: false, error: error.message, products: [] };
  }
}

// Product Save Actions

export async function toggleSaveProduct(userId: string, productId: string) {
  try {
    const savesRef = collection(getFirestoreDb(), "product_saves");
    const q = query(
      savesRef,
      where("userId", "==", userId),
      where("productId", "==", productId),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
      return { success: true, saved: false };
    } else {
      await addDoc(savesRef, {
        userId,
        productId,
        createdAt: Timestamp.now(),
      });
      return { success: true, saved: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function isProductSaved(userId: string, productId: string) {
  try {
    const q = query(
      collection(getFirestoreDb(), "product_saves"),
      where("userId", "==", userId),
      where("productId", "==", productId),
    );
    const snapshot = await getDocs(q);
    return { success: true, saved: !snapshot.empty };
  } catch (error: any) {
    return { success: false, saved: false };
  }
}

export async function getUserSavedProducts(
  userId: string,
  pageSize = 5,
  cursor?: QueryDocumentSnapshot<DocumentData>,
) {
  try {
    const db = getFirestoreDb();

    const savesQuery = cursor
      ? query(
          collection(db, "product_saves"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(cursor),
          limit(pageSize),
        )
      : query(
          collection(db, "product_saves"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize),
        );

    const savesSnapshot = await getDocs(savesQuery);

    if (savesSnapshot.empty) {
      return {
        success: true,
        products: [] as ShopProduct[],
        lastDoc: null,
        hasMore: false,
      };
    }

    const productIds = savesSnapshot.docs.map((d) => d.data().productId);

    const productDocs = await getDocs(
      query(collection(db, "products"), where("__name__", "in", productIds)),
    );

    const productMap = new Map(productDocs.docs.map((d) => [d.id, d]));

    const products: ShopProduct[] = productIds
      .filter((id) => productMap.has(id))
      .map((id) => {
        const d = productMap.get(id)!;
        const p = d.data();

        return {
          productId: d.id,
          userId: p.userId,
          username: p.username,
          userAvatar: p.userAvatar,
          title: p.title,
          price: p.price || "",
          currency: p.currency || "",
          image: p.image,
          affiliateUrl: p.affiliateUrl,
          platform: p.platform || "",
          postId: p.postId ?? undefined,
          createdAt: p.createdAt?.toDate() || new Date(),
          updatedAt: p.updatedAt?.toDate() || new Date(),
        };
      });

    return {
      success: true,
      products,
      lastDoc: savesSnapshot.docs[savesSnapshot.docs.length - 1],
      hasMore: savesSnapshot.docs.length === pageSize,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      products: [] as ShopProduct[],
      lastDoc: null,
      hasMore: false,
    };
  }
}

// Wardrobe Save Actions

export async function toggleSaveWardrobe(userId: string, wardrobeId: string) {
  try {
    const savesRef = collection(getFirestoreDb(), "wardrobe_saves");
    const q = query(
      savesRef,
      where("userId", "==", userId),
      where("wardrobeId", "==", wardrobeId),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
      return { success: true, saved: false };
    } else {
      await addDoc(savesRef, {
        userId,
        wardrobeId,
        createdAt: Timestamp.now(),
      });
      return { success: true, saved: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function isWardrobeSaved(userId: string, wardrobeId: string) {
  try {
    const q = query(
      collection(getFirestoreDb(), "wardrobe_saves"),
      where("userId", "==", userId),
      where("wardrobeId", "==", wardrobeId),
    );
    const snapshot = await getDocs(q);
    return { success: true, saved: !snapshot.empty };
  } catch (error: any) {
    return { success: false, saved: false };
  }
}

export async function getUserSavedWardrobes(
  userId: string,
  pageSize = 5,
  cursor?: QueryDocumentSnapshot<DocumentData>,
) {
  try {
    const db = getFirestoreDb();

    const savesQuery = cursor
      ? query(
          collection(db, "wardrobe_saves"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(cursor),
          limit(pageSize),
        )
      : query(
          collection(db, "wardrobe_saves"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize),
        );

    const savesSnapshot = await getDocs(savesQuery);

    if (savesSnapshot.empty) {
      return {
        success: true,
        wardrobes: [] as WardrobeData[],
        lastDoc: null,
        hasMore: false,
      };
    }

    const wardrobeIds = savesSnapshot.docs.map((d) => d.data().wardrobeId);

    const wardrobeDocs = await getDocs(
      query(collection(db, "wardrobes"), where("__name__", "in", wardrobeIds)),
    );

    const wardrobeMap = new Map(wardrobeDocs.docs.map((d) => [d.id, d]));

    const wardrobes: WardrobeData[] = await Promise.all(
      wardrobeIds
        .filter((id) => wardrobeMap.has(id))
        .map(async (id) => {
          const d = wardrobeMap.get(id)!;
          const data = d.data();

          const productIds: string[] = data.products || [];

          const products: Product[] = await Promise.all(
            productIds.map(async (productId: string) => {
              const productSnap = await getDoc(doc(db, "products", productId));

              if (!productSnap.exists()) return null;

              const productData = productSnap.data();

              return {
                id: productSnap.id,
                productName: productData.title || "",
                productUrl: productData.affiliateUrl || "",
                productImage: productData.image || "",
              } satisfies Product;
            }),
          ).then((items) => items.filter(Boolean) as Product[]);

          return {
            wardrobeId: data.wardrobeId,
            userId: data.userId,
            username: data.username,
            title: data.title,
            description: data.description || "",
            products,
            shareableLink: data.shareableLink,
            views: data.views || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        }),
    );

    return {
      success: true,
      wardrobes,
      lastDoc: savesSnapshot.docs[savesSnapshot.docs.length - 1],
      hasMore: savesSnapshot.docs.length === pageSize,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      wardrobes: [] as WardrobeData[],
      lastDoc: null,
      hasMore: false,
    };
  }
}
