import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function Stars({ rating }) {
  const totalStars = 5;

  const starIcons = Array.from({ length: totalStars }, (_, index) => {
    const starNumber = index + 1;
    if (starNumber <= rating) {
      return <FaStar key={starNumber} className="text-danger" />;
    } else if (starNumber === Math.ceil(rating) && !Number.isInteger(rating)) {
      return <FaStarHalfAlt key={starNumber} className="text-danger" />;
    } else {
      return <FaRegStar key={starNumber} />;
    }
  });

  return <>{starIcons}</>;
}
