import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCart from '@/components/product/AddToCart';
import { useCart } from '@/context/cart';
import OrderSummary from './OrderSummary';



export default function Step1({ onNextStep }) {
  const { cartItems } = useCart();

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary">Review Cart / Adjust Quantity</p>
          {cartItems?.map((product) => (
            <div className="card mb-3" key={product._id}>
              <div className="row g-0">
                <div className="col-md-4">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <Image
                      src={product.images[0]?.secure_url || '/images/new-wave.jpeg'}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">
                      {/* Используйте Link напрямую без вложенного <a> */}
                      <Link href={`/product/${product.slug}`}>
                        {product.title} [{product.images.length} 📸]
                      </Link>
                    </h5>
                    <h4>${product.price.toFixed(2)}</h4>
                    <div className="card-text" dangerouslySetInnerHTML={{
                      __html: product.description.length > 160
                        ? `${product.description.substring(0, 160)}...`
                        : product.description,
                    }} />
                    <div className="mt-3">
                      <AddToCart product={product} reviewAndCheckout={false} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-end my-4">
            <button className="btn btn-danger btn-raised col-6" onClick={onNextStep}>
              Next
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          < OrderSummary/>
        </div>
      </div>
    </div>
  );
}
