// Import statements
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { useProduct } from "@/context/product";
import Stars from "@/components/product/Stars";
import calculateAverageRating from "@/utils/helpers";
import Modal from "@/components/Modal";

// ProductRating component
export default function ProductRating({ product }) {
  // State hooks for product data
  const {
    showRatingModal,
    setShowRatingModal,
    currentRating,
    setCurrentRating,
    comment,
    setComment,
  } = useProduct();

  // State hooks for managing ratings
  const [productRatings, setProductRatings] = useState(product?.ratings || []);
  const [averageRating, setAverageRating] = useState(0);

  // Component return
  return (
    <div>
      <Stars rating={3.5} />
    </div>
  );
}
