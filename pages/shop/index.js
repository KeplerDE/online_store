import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductFilter from "@/components/product/ProductFilter";
import Pagination from "@/components/product/Pagination";
import ProductCard from '@/components/product/ProductCard';

async function getProducts(searchParams) {
  // Создаем строку запроса с параметрами для API
  const searchQuery = new URLSearchParams(searchParams).toString();
  console.log('Search Query:', searchQuery); // Правильное место для логирования строки запроса

  try {
    const apiUrl = `${process.env.API}/product/filters?${searchQuery}`;
    console.log('API URL:', apiUrl); // Логируем URL до отправки запроса

    // Отправляем запрос к API
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`); // Логируем статус ответа при ошибке
    }

    const data = await response.json();
    console.log('Data received:', data); // Правильное место для логирования полученных данных

    if (!data || typeof data !== 'object' || !Array.isArray(data.products)) {
      throw new Error("Invalid data format or no products returned");
    }

    return data;
  } catch (err) {
    console.error('Error fetching products:', err); // Правильное место для логирования ошибки
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
      console.log('Fetching products with query:', router.query); // Лог перед вызовом запроса
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
