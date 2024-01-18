import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";


async function getProducts(searchParams) {
  const searchQuery = new URLSearchParams({
    page: searchParams?.page || 1,
  }).toString();

  const response = await fetch(`${process.env.API}/product?${searchQuery}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Извлекаем параметр страницы из URL
  const { page } = router.query;

  useEffect(() => {
    // Приведение page к числу, так как query параметры всегда возвращаются как строки
    const pageNum = parseInt(page, 10) || 1;

    async function fetchData() {
      try {
        const result = await getProducts({ page: pageNum });
        setProducts(result.products);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [page]); // Зависимость от изменения параметра страницы в URL

  return (
    <div className="container">
      <h1 className="text-center my-4">
        <strong>Latest Products</strong>
      </h1>
      <div className="row g-4">
        {products?.map((product) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        pathname={router.pathname}
      />
    </div>
  );
}