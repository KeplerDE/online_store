import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductFilter from "@/components/product/ProductFilter";

// Функция для обновления параметров фильтра в URL
function updateQueryParams(router, newParams) {
  const currentQuery = router.query;
  const updatedQuery = { ...currentQuery, ...newParams };
  router.push({
    pathname: router.pathname,
    query: updatedQuery,
  }, undefined, { scroll: false }); // Второй параметр - asPath (не изменяется), третий - опции
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const router = useRouter(); // Использование useRouter для доступа к маршруту и параметрам запроса

  useEffect(() => {
    // Функция для получения продуктов по параметрам поиска из URL
    async function fetchProducts() {
      const searchParams = new URLSearchParams(router.query).toString();
      try {
        // Здесь должен быть ваш API-запрос, например, используя fetch
        const response = await fetch(`/api/products?${searchParams}`);
        const data = await response.json();
        setProducts(data); // Обновление состояния продуктов
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }

    fetchProducts();
  }, [router.query]); // Зависимость от query параметров URL

  // Обработчик фильтра, который вызывается при изменении фильтров в компоненте ProductFilter
  const handleFilterChange = (filterName, value) => {
    const newParams = { ...router.query, [filterName]: value, page: 1 }; // Сброс страницы на первую при изменении фильтров
    updateQueryParams(router, newParams);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3">
          <ProductFilter
            searchParams={router.query}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="col-lg-9">
          {products.map((product) => (
            <div key={product.id}>{}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
