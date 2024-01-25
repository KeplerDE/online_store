// Import statements
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { useProduct } from "@/context/product";
import Stars from "@/components/product/Stars";
import { calculateAverageRating } from "@/utils/helpers";
import { useSession } from "next-auth/react";
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

  
  // current user

  const { data, status } = useSession();
  const alreadyRated = productRatings?.find(
    (rate) => rate?.postedBy?._id === data?.user?._id
    ); 

  useEffect(() => {
    if (alreadyRated) {
      setCurrentRating(alreadyRated?.rating);
      setComment(alreadyRated?.comment);
    } else {
      setCurrentRating(0);
      setComment("");
    } 
  }, [alreadyRated]);
  
  useEffect(() => {
    if (productRatings) {
      const average = calculateAverageRating(productRatings);
      setAverageRating(average);
    }
    }, [product?.ratings]);
  



  // Component return
  return (
    <div>
      <Stars rating={averageRating} />
      <small className="text-muted"> ({productRatings?.length})</small>
    </div>
  );
}
