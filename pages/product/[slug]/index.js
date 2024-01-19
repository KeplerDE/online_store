import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import ProductImage from "@/components/product/ProductImage";

dayjs.extend(relativeTime);

// Функция для получения данных о продукте
async function getProducts(slug) {
  try {
    const response = await fetch(`${process.env.API}/product/${slug}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// getServerSideProps для серверного рендеринга страницы продукта
export async function getServerSideProps({ params }) {
  const product = await getProducts(params.slug);

  if (!product) {
    return { notFound: true };
  }

  return { props: { product } };
}

export default function ProductViewPage({ product }) {
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card">
            {/* images and preview modal */}
            <ProductImage product={product} />
            {/* card body */}
            <div className="card-body">
              <h5 className="card-title">{product.title}</h5>
              <div className="card-text">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <small className="text-muted">Category: {product.category.name}</small>
              <small className="text-muted">Tags: {product.tags.map(tag => tag.name).join(" ")}</small>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <small className="text-muted">Ratings</small>
              <small className="text-muted">
                Added {dayjs(product.createdAt).fromNow()}
              </small>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          {/* Add to cart / wishlist functionality */}
        </div>
      </div>
      <div className="row">
        <div className="col my-5">
          <p className="lead">Related products</p>
          {/* Display related products */}
        </div>
      </div>
    </div>
  );
}
