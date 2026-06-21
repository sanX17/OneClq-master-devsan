export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  products: string[]; // Product Ids
  likes: number;
  saves: number;
  createdAt: Date;
  caption?: string;
}

export interface PostData {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  products: Product[];
  likes: number;
  saves: number;
  createdAt: Date;
  caption?: string;
  tags?: string[];
}

export interface Product {
  id: string;
  productName: string;
  productUrl: string;
  productImage: string;
}

export interface ShopProduct {
  productId: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  price?: string;
  currency?: string;
  image: string;
  affiliateUrl: string;
  platform?: string;
  postId?: string; // set when product came from a post
  createdAt: Date;
  updatedAt: Date;
}

export interface Wardrobe {
  wardrobeId: string;
  userId: string;
  username: string;
  title: string;
  description?: string;
  products: string[];
  shareableLink: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WardrobeData {
  wardrobeId: string;
  userId: string;
  username: string;
  title: string;
  description?: string;
  products: Product[];
  shareableLink: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio?: string;
  createdAt: Date;
}
