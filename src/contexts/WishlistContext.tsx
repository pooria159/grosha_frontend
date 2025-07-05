import React, { createContext, useContext, useEffect, useState } from "react";

export interface WishlistItem {
  productId: number;
  name: string;
  image: string;
  description: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const userId = localStorage.getItem("user-id");

  useEffect(() => {
  if (userId) {
    const stored = localStorage.getItem(`wishlist-${userId}`);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist([]); 
    }
  } else {
    setWishlist([]);
  }
}, [userId]);


  const addToWishlist = (item: WishlistItem) => {
    if (!userId) return;

    setWishlist((prev) => {
      const exists = prev.some((i) => i.productId === item.productId);
      if (!exists) {
        const updated = [...prev, item];
        localStorage.setItem(`wishlist-${userId}`, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId: number) => {
    if (!userId) return;

    setWishlist((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      localStorage.setItem(`wishlist-${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
