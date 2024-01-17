import React from "react";
import ProductList from "@/components/product/admin/ProductList";

const ProductListPage = () => {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead mb-4">List of Products</p>
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
