"use client";

import { useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { useProduct } from "@/context/product";
import { useRouter } from "next/router";

export default function SearchProductsPage() {
  const {
    setProductSearchQuery,
    setProductSearchResults,
    productSearchResults,
  } = useProduct();

  const productSearchParams = useSearchParams();
  const query = productSearchParams.get("productSearchQuery");
  const router = useRouter();

 
  const fetchProductResultsOnLoad = async (query) => {
    try {
      const response = await fetch(
        `${process.env.API}/search/products?productSearchQuery=${query}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok for search results");
      }
      const data = await response.json();
      console.log("search results data => ", data);
      setProductSearchResults(data);
      router.push(`/search/products?productSearchQuery=${query}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (query) {
      setProductSearchQuery(query);
      fetchProductResultsOnLoad(query);
    }

  }, [query]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4>Search Results {productSearchResults?.length}</h4>
          <hr />
          <div className="row">
            {productSearchResults?.map((product) => (
              <div className="col-lg-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
