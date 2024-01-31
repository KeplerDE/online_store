import { priceRanges } from "../../utils/filterData";
import Link from "next/link";

export default function ProductFilter({ searchParams }) {
  return (
    <div>
      <p className="lead">Filter Products</p>

      <p className="text-primary mt-4 alert alert-secondary">Price</p>
      <div className="row d-flex align-items-center mx-1">
        {priceRanges?.map((range) => {
          const url = {
            pathname: '/shop/', 
            query: {
              ...searchParams,
              minPrice: range?.min,
              maxPrice: range?.max,
              page: 1,
            },
          };

          return <Link href={url}>{range?.label}</Link>;
        })}
      </div>
      <pre>{JSON.stringify(searchParams, null, 4)}</pre>
    </div>
  );
}
