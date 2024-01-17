import React, { useEffect } from "react";
import { useProduct } from "@/context/product";
import { useRouter } from "next/router";

const ProductList = () => {
  const {
    products,
    currentPage,
    totalPages,
    fetchProducts,
    setUpdatingProduct,
  } = useProduct();
  const router = useRouter();

  const { page } = router.query;

  useEffect(() => {
    fetchProducts(Number(page));
  }, [page]);

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <div className="container my-5">
      <div className="row">
        {/* Render your product list here */}
        {products.map((product) => (
          <div key={product.id} className="col-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <a
                  href={`/products/${product.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(`/products/${product.id}`);
                  }}
                  className="btn btn-primary"
                >
                  View Details
                </a>
                <button
                  className="btn btn-danger"
                  onClick={() => setUpdatingProduct(product)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="col-12 mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <a
                    href={`/products?page=${index + 1}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(`/products?page=${index + 1}`);
                    }}
                    className="page-link"
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
