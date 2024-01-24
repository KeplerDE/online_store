import Image from "next/image";
import { useProduct } from "@/context/product";
import Modal from "@/components/Modal"; 

export default function ProductImage({ product }) {

  const { 
    showImagePreviewModal, 
    currentImagePreviewUrl, 
    closeModal,
    openImagePreviewModal
  } = useProduct();

  const ImageThumbnail = ({ src, alt }) => (
    <div
      className="pointer"
      style={{ height: "350px", overflow: "hidden" }}
      onClick={() => openImagePreviewModal(src)}
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
        <Modal>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Image
              src={currentImagePreviewUrl}
              alt={product?.title}
              width={450} 
              height={325} 
              objectFit="contain"
              layout="intrinsic" 
            />
          </div>
        </Modal>
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
