import Image from "next/image";
import { useState } from "react";

export default function ProductImage({ product }) {
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");

  const openModal = (url) => {
    setCurrentImagePreviewUrl(url);
    setShowImagePreviewModal(true);
  };

  const closeModal = () => {
    setShowImagePreviewModal(false);
    setCurrentImagePreviewUrl("");
  };

  const ImageThumbnail = ({ src, alt }) => (
    <div
      className="pointer"
      style={{ height: "350px", overflow: "hidden" }}
      onClick={() => openModal(src)}
    >
    <Image
      src={src}
      alt={alt}
      layout="responsive" 
      width={250} 
      height={250} 
      objectFit="contain" 
    />
    </div>
  );

  return (
    <>
      {showImagePreviewModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ height: "calc(100% - 60px)" }}>
            <div className="modal-content" style={{ height: "calc(100% - 60px)" }}>
              <div className="modal-body overflow-auto">
                <Image
                  src={currentImagePreviewUrl}
                  alt={product?.title}
                  layout="fill" // Change to fill to use the parent dimensions
                  objectFit="contain"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center">
        {product?.images?.length > 0 ? (
          product.images.map((image) => (
            <ImageThumbnail key={image.public_id} src={image.secure_url} alt={product.title} />
          ))
        ) : (
          <ImageThumbnail src="/images/default.jpeg" alt="Default Image" />
        )}
      </div>
    </>
  );
}
