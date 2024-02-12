import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductFilter from "@/components/product/ProductFilter";
import Pagination from "@/components/product/Pagination";
import ProductCard from '@/components/product/ProductCard';

async function getProducts(searchParams) {
  // Создаем строку запроса с параметрами для API
  const searchQuery = new URLSearchParams(searchParams).toString();

  try {
    // Отправляем запрос к API
    const response = await fetch(`${process.env.API}/product?${searchQuery}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    console.log(data);

    if (!data || typeof data !== 'object' || !Array.isArray(data.products)) {
      throw new Error("No products returned");
    }

    return data;
  } catch (err) {
    console.error(err);
    return { products: [], currentPage: 1, totalPages: 1 };
  }
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // useEffect для загрузки продуктов при изменении параметров запроса
  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts(router.query);
      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    }

    if (router.isReady) {
      fetchProducts();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 overflow-auto" style={{ maxHeight: "90vh" }}>
          <ProductFilter searchParams={router.query} />
        </div>
        <div className="col-lg-9 overflow-auto" style={{ maxHeight: "90vh" }}>
          {/* Здесь можно отобразить продукты, возможно в виде карточек или списка */}
          <div className="row">
            {products?.map((product) => (
              <div key={product.id} className="col-lg-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <br />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={router.query}
            pathname="/shop"
          />
        </div>
      </div>
    </div>
  );
}
