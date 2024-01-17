"use client";
import { useEffect } from "react";
import { useProduct } from "@/context/product";
import { useRouter } from "next/router";
import Image from "next/image";

export default function ProductList() {
  const {
    products,
    fetchProducts,
    setUpdatingProduct,
  } = useProduct();
  const router = useRouter();
  const page = router.query.page;

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleClick = (product) => {
    setUpdatingProduct(product);
    router.push("/dashboard/admin/product");
  };

  return (
    <div className="container my-5">
      <div className="row gx-3">
        {products?.map((product) => (
          <div key={product?._id} className="col-lg-6 my-3">
            <div style={{ height: "200px", overflow: "hidden" }}>
              <Image
                src={product?.images[0]?.secure_url || "/images/default.jpg"}
                alt={product?.title}
                width={500}
                height={300}
                objectFit="cover"
                layout="responsive"
              />
            </div>
            <div className="card-body">
              <h5
                className="card-title"
                onClick={() => handleClick(product)}
                style={{ cursor: 'pointer' }}
              >
                ${product?.price?.toFixed(2)} {product?.title}
              </h5>
              <p className="card-text" dangerouslySetInnerHTML={{
                  __html:
                    product?.description?.length > 160
                      ? `${product?.description.substring(0, 160)}..`
                      : product?.description,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
