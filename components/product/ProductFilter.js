"use client"; 
import { useRouter } from 'next/router';
import { useState } from 'react';
import { priceRanges } from "../../utils/filterData";
import Link from "next/link";

export default function ProductFilter({ searchParams }) {
  const router = useRouter();
  const [activeRange, setActiveRange] = useState({ minPrice: '', maxPrice: '' });
  const pathname = "/shop";

  const activeButton = "btn btn-secondary btn-raised mx-1 border-2";
  const button = "btn btn-secondary mx-1 border-2";

  const handleButtonClick = (min, max) => {
    setActiveRange({ minPrice: min, maxPrice: max });
  };

  // Функция для удаления фильтра
  const handleRemoveFilter = (filterName) => {
    const updatedSearchParams = { ...searchParams };
    delete updatedSearchParams[filterName];
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
      <pre>{JSON.stringify(searchParams, null, 4)}</pre>
    </div>
  );
}
