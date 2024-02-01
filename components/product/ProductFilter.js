import { useRouter } from 'next/router';
import { useState } from 'react';
import { priceRanges } from "../../utils/filterData";
import Link from "next/link";
import Stars from "@/components/product/Stars"; // Проверьте правильность пути импорта

export default function ProductFilter({ searchParams }) {
  const router = useRouter();
  const [activeRange, setActiveRange] = useState({ minPrice: '', maxPrice: '' });
  const pathname = "/shop";

  const activeButton = "btn btn-secondary btn-raised mx-1 border-2";
  const button = "btn btn-secondary mx-1 border-2";

  const handleButtonClick = (min, max) => {
    setActiveRange({ minPrice: min, maxPrice: max });
  };

  // Обновлённая функция для удаления фильтра
  const handleRemoveFilter = (filterName) => {
    const updatedSearchParams = { ...searchParams };
    
    if (typeof filterName === "string") {
      delete updatedSearchParams[filterName];
    } else if (Array.isArray(filterName)) {
      filterName.forEach((name) => {
        delete updatedSearchParams[name];
      });
    }

    updatedSearchParams.page = 1;
    const queryString = new URLSearchParams(updatedSearchParams).toString();
    const newUrl = `${pathname}?${queryString}`;
    router.push(newUrl);
  };

  return (
    <div>
      <p className="lead">Filter Products</p>
      
      <div
        className='text-danger'
        onClick={() => handleRemoveFilter(['minPrice', 'maxPrice'])}
        style={{ cursor: 'pointer' }}
      >
        Clear Filters
      </div>

      <p className="text-primary mt-4 alert alert-secondary">Price</p>
      <div className="row d-flex align-items-center mx-1">
        {priceRanges?.map((range) => {
          const isActive =
            activeRange.minPrice === range?.min && activeRange.maxPrice === range?.max;
          const url = {
            pathname,
            query: {
              ...searchParams,
              minPrice: range?.min,
              maxPrice: range?.max,
              page: 1,
            },
          };

          return (
            <Link href={url} key={range.label}>
              <span
                className={isActive ? activeButton : button}
                onClick={() => handleButtonClick(range?.min, range?.max)}
              >
                {range?.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Блок для рейтинга */}
      <p className="text-primary mt-4 alert alert-secondary">Ratings</p>
      <div className="row d-flex align-items-center mx-1">
        {[5, 4, 3, 2, 1].map((ratingValue) => {
          const isActive = searchParams && String(searchParams.ratings) === String(ratingValue);
          const url = {
            pathname,
            query: {
              ...searchParams,
              ratings: ratingValue,
              page: 1,
            },
          };
          return (
            <div key={ratingValue}>
              <Link href={url}>
                <span className={isActive ? activeButton : button}>
                  <Stars rating={ratingValue} />
                </span>
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter("ratings")}
                  className="pointer"
                >
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>

      <pre>{JSON.stringify(searchParams, null, 4)}</pre>
    </div>
  );
}
