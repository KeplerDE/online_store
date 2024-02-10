"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; 
import { useCategory } from '@/context/category';
import { useTag } from '@/context/tag';
import { useProduct } from '@/context/product';
import Stars from '../../components/product/Stars';
import { priceRanges } from '../../utils/filterData';

export default function ProductFilter({ searchParams }) {
  const pathname = '/shop';
  const { minPrice, maxPrice, ratings, category, tag, brand } = searchParams;

  // Получение контекстов
  const { fetchCategoriesPublic, categories } = useCategory();
  const { fetchTagsPublic, tags } = useTag();
  const { fetchBrands, brands } = useProduct();
  const router = useRouter();

  // 
  const activeButton = 'btn btn-primary btn-raised mx-1 rounded-pill';
  const button = 'btn btn-raised mx-1 rounded-pill';

  useEffect(() => {
    fetchCategoriesPublic();
    fetchTagsPublic();
    fetchBrands();
  }, []);

  const handleRemoveFilter = (filterName) => {
    const updatedSearchParams = { ...searchParams };

    if (typeof filterName === 'string') {
      delete updatedSearchParams[filterName];
    } else if (Array.isArray(filterName)) {
      filterName.forEach((name) => delete updatedSearchParams[name]);
    }

    updatedSearchParams.page = 1;
    router.push({ pathname, query: updatedSearchParams });
  };

  return (
    <div>
      <p className="lead">Filter Products</p>
      <Link href="/shop" className="text-danger">
        Clear Filters
      </Link>

      {/* Price Filter */}
      <p className="mt-4 alert alert-primary">Price</p>
      <div className="row d-flex align-items-center mx-1">
        {priceRanges.map((range) => {
          const isActive = minPrice === String(range.min) && maxPrice === String(range.max);
          const url = { pathname, query: { ...searchParams, minPrice: range.min, maxPrice: range.max, page: 1 } };

          return (
            <div key={range.label}>
              <Link href={url} className={isActive ? activeButton : button}>
                {range.label}
              </Link>
              {isActive && (
                <span onClick={() => handleRemoveFilter(['minPrice', 'maxPrice'])} className="pointer">
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Ratings Filter */}
      <p className="mt-4 alert alert-primary">Ratings</p>
      <div className="row d-flex align-items-center mx-1">
        {[5, 4, 3, 2, 1].map((rating) => {
          const isActive = ratings === String(rating);
          const url = { pathname, query: { ...searchParams, ratings: rating, page: 1 } };

          return (
            <div key={rating}>
              <Link href={url} className={isActive ? activeButton : button}>
                <Stars rating={rating} />
              </Link>
              {isActive && (
                <span onClick={() => handleRemoveFilter('ratings')} className="pointer">
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Categories Filter */}
      <p className="mt-4 alert alert-primary">Categories</p>
      <div className="row d-flex align-items-center mx-1 filter-scroll">
        {categories.map((c) => {
          const isActive = category === c._id;
          const url = { pathname, query: { ...searchParams, category: c._id, page: 1 } };

          return (
            <div key={c._id}>
              <Link href={url} className={isActive ? activeButton : button}>
                {c.name}
              </Link>
              {isActive && (
                <span onClick={() => handleRemoveFilter('category')} className="pointer">
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Tags Filter */}
      {category && (
        <>
          <p className="mt-4 alert alert-primary">Tags</p>
          <div className="row d-flex align-items-center mx-1 filter-scroll">
            {tags
              .filter((t) => t.parentCategory && t.parentCategory._id === category) 
              .map((t) => {
                const isActive = tag === t._id; 
                const url = { pathname, query: { ...searchParams, tag: t._id, page: 1 } }; 

                return (
                  <div key={t._id}>
                    <Link href={url} className={isActive ? activeButton : button}>
                      {t.name}
                    </Link>
                    {isActive && (
                      <span onClick={() => handleRemoveFilter('tag')} className="pointer">
                        X
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}
      {/* <pre>{JSON.stringify(tags, null, 4)}</pre> */}
      {/* Brands Filter */}
      <p className="mt-4 alert alert-primary">Brands</p>
      <div className="row d-flex align-items-center mx-1 filter-scroll">
        {brands.map((b) => {
          const isActive = brand === b;
          const url = { pathname, query: { ...searchParams, brand: b, page: 1 } };

          return (
            <div key={b}>
              <Link href={url} className={isActive ? activeButton : button}>
                {b}
              </Link>
              {isActive && (
                <span onClick={() => handleRemoveFilter('brand')} className="pointer">
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
