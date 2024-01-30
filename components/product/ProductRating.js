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
import { FaStar, FaRegStar } from "react-icons/fa";


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
  const router = useRouter();
  const pathname = usePathname();

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
  
    const submitRating = async () => {
      if (status !== "authenticated") {
        toast.error("You must be logged in to leave a rating");
        router.push(`/login?callbackUrl=${pathname}`);
        return;
      }
    
    try {
      const payload = {
        productId: product?._id,
        rating: currentRating,
        comment,
      };
  
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(payload),
      };
  
      const response = await fetch(`${process.env.API}/user/product/rating`, requestOptions);
  
      if (!response.ok) {
        throw new Error("Failed to leave a rating");
      }
  
      const data = await response.json();
      setProductRatings(data?.ratings);
      setShowRatingModal(false);
      toast.success("Thanks for leaving a rating");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Error leaving a rating");
    }
  };
    


  // Component return
  return (
    <div className="product-rating-footer">
      <div className="rating-info">
        <Stars rating={averageRating} />
        <small className="text-muted"> ({productRatings?.length || 0})</small>
      </div>
      <div className="rating-action">
        <small 
          onClick={() => setShowRatingModal(true)} 
          className="pointer text-primary" 
          style={{ textDecoration: 'underline' }}
        >
          {alreadyRated ? "Update your rating" : "Leave a rating"}
        </small>
      </div>

      {showRatingModal && (
        <Modal>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-4"
              placeholder="Write a review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="stars-container mb-4">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <span
                    key={ratingValue}
                    className={`star ${ratingValue <= currentRating ? "star-active" : ""}`}
                    onClick={() => setCurrentRating(ratingValue)}
                    style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                  >
                    {ratingValue <= currentRating ? (
                      <FaStar className="text-danger" />
                    ) : (
                      <FaRegStar />
                    )}
                  </span>
                );
              })}
            </div>
            <button
              onClick={submitRating}
              className="btn btn-primary btn-block"
            >
              Submit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}