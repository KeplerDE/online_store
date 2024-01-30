import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductRating from "./ProductRating";

dayjs.extend(relativeTime);

export default function ProductCard({ product }) {
  const { _id, images, title, description, category, tags, createdAt, brand } = product || {};

  const formatDescription = (text) => {
    return text && text.length > 160 ? `${text.substring(0, 160)}...` : text;
  };

  return (
    <div key={_id} className="card my-3">
      <div style={{ height: "200px", overflow: "hidden" }}>
        <Image
          src={images?.[0]?.secure_url || "/images/default.jpg"}
          width={500}
          height={300}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          alt={title}
        />
      </div>
      <div className="card-body">
        <Link href={`/product/${product?.slug}`}>
            <h5 className="card-title">{product?.title}</h5>
        </Link>

        <p>{formatDescription(description)}</p>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <small>Category: {category?.name}</small>
        <small>Tags: {tags?.map(t => t?.name).join(" ")}</small>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <small>❤ Likes</small>
        <small>Posted {dayjs(createdAt).fromNow()}</small>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <small>Brand: {brand}</small>
        <ProductRating product={product}/>
      </div>

    </div>
  );
}
