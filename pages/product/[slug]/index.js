import Head from 'next/head';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ProductImage from '@/components/product/ProductImage';
import ProductLike from '@/components/product/ProductLike';
import ProductRating from '@/components/product/ProductRating';
import UserReviews from '@/components/product/UserReviews';
import CouponCode from '@/components/product/CouponCode';

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

// Функция для генерации метадаты
async function generateMetadata(product) {
  return {
    title: product?.title,
    description: product?.description?.substr(0, 160),
  };
}

// getServerSideProps для серверного рендеринга страницы продукта
export async function getServerSideProps({ params }) {
  const product = await getProducts(params.slug);

  if (!product) {
    return { notFound: true };
  }

  const metadata = await generateMetadata(product);

  return { props: { product, metadata } };
}

// Компонент страницы просмотра продукта
export default function ProductViewPage({ product, metadata }) {
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <div className="container mb-5">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card">
              <ProductImage product={product} />
              <CouponCode product={product} />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\./g, "<br/><br/>") }} />
              </div>
              <div className="card-footer d-flex justify-content-between">
                <small className="text-muted">Category: {product.category.name}</small>
                <small className="text-muted">Tags: {product.tags.map(tag => tag.name).join(" ")}</small>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <ProductLike product={product} />
                <small>Posted {dayjs(product.createdAt).fromNow()}</small>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <small>Brand: {product.brand}</small>
                <ProductRating product={product} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col my-5">
            <p className="lead">Related products</p>
            {/* Здесь можно добавить вывод связанных продуктов */}
          </div>
        </div>
        <div className="row">
          <div className="col my-5">
            <UserReviews reviews={product?.ratings} />
          </div>
        </div>
      </div>
    </>
  );
}
