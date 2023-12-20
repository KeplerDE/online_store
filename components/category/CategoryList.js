"use client";
import { useState, useEffect } from "react";
import { useCategory } from "@/context/category";

export default function CategoryList() {
  // Using category context
  const { categories, fetchCategories, setUpdatingCategory } = useCategory();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          {categories.map((c) => (
            <button
              className="btn"
              onClick={() => setUpdatingCategory(c)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
