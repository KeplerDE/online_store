"use client";

import { priceRanges } from "../../utils/filterData"
import Link from "next/link";
import { useRouter } from "next/navigation";
import Stars from "../../components/product/Stars";

export default function ProductFilter({ searchParams }) {
  const pathname = "/shop";
  const {
    minPrice = null,
    maxPrice = null,
    ratings = null,
    category = null,
    tag = null,
    brand = null
  } = searchParams || {};

  const router = useRouter();

  const activeButton = "btn btn-primary btn-raised mx-1 rounded-pill";
  const button = "btn btn-secondary btn-raised mx-1 rounded-pill";

  const handleRemoveFilter = (filterName) => {
    const updatedSearchParams = { ...searchParams };
    // delete updatedSearchParams[filterName];

    // if filterName is string
    if (typeof filterName === "string") {
      delete updatedSearchParams[filterName];
    }

    // if filterName is array
    if (Array.isArray(filterName)) {
      filterName?.forEach((name) => {
        delete updatedSearchParams[name];
      });
    }

    // reset page to 1 when applying new filtering options
    updatedSearchParams.page = 1;

    const queryString = new URLSearchParams(updatedSearchParams).toString();
    const newUrl = `${pathname}?${queryString}`;
    router.push(newUrl);
  };

  return (
    <div>
      <p className="lead">Filter Products</p>
      <Link className="text-danger" href="/shop">
        Clear Filters
      </Link>
      <p className="mt-4 alert alert-primary">Price</p>
      <div className="row d-flex align-items-center mx-1">
        {priceRanges.map((range) => {
          const url = {
            pathname,
            query: {
              ...searchParams,
              minPrice: range?.min,
              maxPrice: range?.max,
              page: 1,
            },
          };

          const isActive =
            minPrice === String(range?.min) && maxPrice === String(range?.max);

          return (
            <div key={range?.label}>
              <Link href={url} className={isActive ? activeButton : button}>
                {range?.label}
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter(["minPrice", "maxPrice"])}
                  className="pointer"
                >
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 alert alert-primary">Ratings</p>
      <div className="row d-flex align-items-center mx-1">
        {[5, 4, 3, 2, 1].map((ratingValue) => {
          const isActive = String(ratings) === String(ratingValue);
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
              <Link
                href={url}
                className={isActive ? "btn btn-primary btn-raised mx-1 rounded-pill" : "btn btn-raised mx-1 rounded-pill"}
              >
                <Stars rating={ratingValue} />
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
    </div>
  );
}
