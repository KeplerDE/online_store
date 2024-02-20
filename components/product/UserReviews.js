import RatingDistribution from "@/components/product/RatingDistribution";
import Stars from "@/components/product/Stars";

export default function UserReviews({ reviews }) {
  // Render either the list of reviews or a message indicating there are no reviews
  const renderReviews = () => {
    if (reviews && reviews.length > 0) {
      return (
        <div>
          <RatingDistribution reviews={reviews} />
          <ul className="list-group mt-4 bg-white">
            {reviews.map((review) => (
              <li key={review._id} className="list-group-item mb-1">
                <div>
                  <p>
                    <strong>{review.postedBy.name}</strong>
                  </p>
                  <Stars rating={review.rating} />
                  {review.comment && <p className="mt-3">{review.comment}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return <p>No reviews yet.</p>;
    }
  };

  return (
    <>
      {renderReviews()}
    </>
  );
}
