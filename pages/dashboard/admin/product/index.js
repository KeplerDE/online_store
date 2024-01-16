import React from "react";
import ProductCreate from "@/components/product/ProductCreate";

export default function AddProductPage() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <ProductCreate />
        </div>
      </div>
    </div>
  );
}
