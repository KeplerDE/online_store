export function calculateAverageRating(ratings) {
    if (!ratings.length) {
      return 0; // Возвращаем 0, если массив рейтингов пуст
    }
  
    const totalRating = ratings.reduce((acc, ratingObj) => acc + ratingObj.rating, 0);
    const averageRating = totalRating / ratings.length;
    return averageRating;
  }
  