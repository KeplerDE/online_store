import React, { useState, useEffect } from 'react';
import ProductFilter from "@/components/product/ProductFilter";

async function getProducts(searchParams) {
  const searchQuery = new URLSearchParams({
    page: searchParams.page || 1,
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    ratings: searchParams.ratings || "",
    category: searchParams.category || "",
    tag: searchParams.tag || "",
    brand: searchParams.brand || "",
  }).toString();
 
}

export default function Shop({ searchParams }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getProducts(searchParams);
        setProducts(result); 
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [searchParams]); 

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3">
          <ProductFilter searchParams={searchParams} />
        </div>
        <div className="col-lg-9">
          {/* Render the products list */}
          {products.map((product) => (
            <div key={product.id}>{/* Render product here */}</div>
          ))}
        </div>
      </div>
    </div>
  );
}