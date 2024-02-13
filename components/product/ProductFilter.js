"use client";
import { useEffect } from "react";
import { priceRanges } from "@/utils/filterData"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Stars from "@/components/product/Stars"; 
import { useCategory } from "@/context/category"; 
import { useTag } from "@/context/tag"; 
import { useProduct } from "@/context/product"; 

export default function ProductFilter({ searchParams }) {
  const pathname = "/shop";
  const { minPrice, maxPrice, ratings, category, tag, brand } = searchParams;
  
  // Использование контекста
  const { fetchCategoriesPublic, categories } = useCategory();
  const { fetchTagsPublic, tags } = useTag();
  const { fetchBrands, brands } = useProduct();
  
  useEffect(() => {
    // Получение данных при монтировании компонента
    fetchCategoriesPublic();
    fetchTagsPublic();
    fetchBrands();
  }, []);
  
  const router = useRouter();
  const activeButton = "btn btn-primary btn-raised mx-1 rounded-pill"; // Стиль для активной кнопки
  const button = "btn btn-raised mx-1 rounded-pill"; // Стиль для обычной кнопки
  
  // Функция для удаления фильтра
  const handleRemoveFilter = (filterName) => {
    const updatedSearchParams = { ...searchParams };
    // Удаление параметра фильтра
    if (typeof filterName === "string") {
      delete updatedSearchParams[filterName];
    }
    // Удаление нескольких параметров фильтра
    if (Array.isArray(filterName)) {
      filterName.forEach((name) => {
        delete updatedSearchParams[name];
      });
    }
    // Сброс страницы на первую при применении новых фильтров
    updatedSearchParams.page = 1;
    const queryString = new URLSearchParams(updatedSearchParams).toString();
    const newUrl = `${pathname}?${queryString}`;
    router.push(newUrl);
  };

  return (
    <div className="mb-5 overflow-scroll">
      <p className="lead">Фильтровать продукты</p>
      <Link className="text-danger" href="/shop">Очистить фильтры</Link>
      
      {/* Фильтрация по цене */}
      <p className="mt-4 alert alert-primary">Цена</p>
      <div className="row d-flex align-items-center mx-1">
        {priceRanges.map((range) => {
          const url = {
            pathname,
            query: { ...searchParams, minPrice: range.min, maxPrice: range.max, page: 1 },
          };
          const isActive = minPrice === String(range.min) && maxPrice === String(range.max);
          return (
            <div key={range.label}>
              <Link href={url} className={isActive ? activeButton : button}>{range.label}</Link>
              {isActive && (
                <span onClick={() => handleRemoveFilter(["minPrice", "maxPrice"])} className="pointer">X</span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Фильтрация по рейтингу */}
      <p className="mt-4 alert alert-primary">Рейтинг</p>
      <div className="row d-flex align-items-center mx-1">
        {[5, 4, 3, 2, 1].map((ratingValue) => {
          const isActive = String(ratings) === String(ratingValue);
          const url = {
            pathname,
            query: { ...searchParams, ratings: ratingValue, page: 1 },
          };
          return (
            <div key={ratingValue}>
              <Link href={url} className={isActive ? "btn btn-primary btn-raised mx-1 rounded-pill" : "btn btn-raised mx-1 rounded-pill"}>
                <Stars rating={ratingValue} />
              </Link>
              {isActive && (<span onClick={() => handleRemoveFilter("ratings")} className="pointer">X</span>)}
            </div>
          );
        })}
      </div>
      
      {/* Фильтрация по категориям */}
      <p className="mt-4 alert alert-primary">Категории</p>
      <div className="row d-flex align-items-center mx-1 filter-scroll">
        {categories.map((c) => {
          const isActive = category === c._id;
          const url = {
            pathname,
            query: { ...searchParams, category: c._id, page: 1 },
          };
          return (
            <div key={c._id}>
              <Link href={url} className={isActive ? activeButton : button}>
                {c.name}
              </Link>
              {isActive && (
                <span onClick={() => handleRemoveFilter("category")} className="pointer">X</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Условный рендеринг для фильтрации по тегам, если выбрана категория */}
      {category && (
        <>
          <p className="mt-4 alert alert-primary">Теги</p>
          <div className="row d-flex align-items-center mx-1 filter-scroll">
            {tags.filter(t => t.parentCategory === category).map((t) => {
              const isActive = tag === t._id;
              const url = {
                pathname,
                query: { ...searchParams, tag: t._id, page: 1 },
              };
              return (
                <div key={t._id}>
                  <Link href={url} className={isActive ? activeButton : button}>
                    {t.name}
                  </Link>
                  {isActive && (
                    <span onClick={() => handleRemoveFilter("tag")} className="pointer">X</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Фильтрация по брендам */}
      <p className="mt-4 alert alert-primary">Бренды</p>
      <div className="row d-flex align-items-center mx-1 filter-scroll">
        {brands.map((b) => {
          const isActive = brand === b;
          const url = {
            pathname,
            query: { ...searchParams, brand: b, page: 1 },
          };
          return (
            <div key={b}>
              <Link href={url} className={isActive ? activeButton : button}>
                {b}
              </Link>
              {isActive && (
                <span onClick={() => handleRemoveFilter("brand")} className="pointer">X</span>
              )}
            </div>
          );
        })}
      </div>
    </div>  
  );
}
