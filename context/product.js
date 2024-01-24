import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Resizer from "react-image-file-resizer";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // State
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // image preview modal
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");

  // rating system
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [comment, setComment] = useState("");
 
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [userComment, setUserComment] = useState("");

  // Функция для открытия модального окна просмотра изображений и оценок
  const handleOpenImagePreview = (imageUrl) => {
    setCurrentImagePreviewUrl(imageUrl);
    setShowImagePreviewModal(true);
  };

  // Функция для закрытия модальных окон
  const handleCloseModal = () => {
    setShowImagePreviewModal(false);
    setIsRatingModalVisible(false);
  };

  // Обработчик клика вне модального окна
  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleCloseModal();
    }
  };

  const openImagePreviewModal = (url) => {
    setCurrentImagePreviewUrl(url);
    setShowImagePreviewModal(true);
  };

  const closeModal = () => {
    setShowImagePreviewModal(false);
    setCurrentImagePreviewUrl("");
  };

  const uploadImages = (e) => {
    const files = e.target.files;
    const allUploadedFiles = updatingProduct
      ? updatingProduct.images || []
      : product
      ? product.images || []
      : [];
  
    if (files) {
      // Проверяем, не превышает ли общее количество загружаемых изображений 4
      const totalImages = allUploadedFiles.length + files.length;
      if (totalImages > 4) {
        alert("You can't upload more than 4 images.");
        return;
      }
  
      setUploading(true);
      const uploadPromises = [];
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const promise = new Promise((resolve) => {
          // Используем библиотеку Resizer для изменения размера изображения
          Resizer.imageFileResizer(
            file,
            1280,
            720,
            "JPEG",
            100,
            0,
            (uri) => {
              // Отправляем изображение на сервер для загрузки
              fetch(`${process.env.API}/admin/upload/image`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: uri }),
              })
                .then((response) => response.json())
                .then((data) => {
                  // Вставляем новое изображение в начало массива
                  allUploadedFiles.unshift(data);
                  resolve();
                })
                .catch((err) => {
                  console.log("CLOUDINARY UPLOAD ERR", err);
                  resolve();
                });
            },
            "base64"
          );
        });
  
        uploadPromises.push(promise);
      }
  
      Promise.all(uploadPromises)
        .then(() => {
          // Обновляем состояние после загрузки всех изображений
          updatingProduct
            ? setUpdatingProduct({
                ...updatingProduct,
                images: allUploadedFiles,
              })
            : setProduct({ ...product, images: allUploadedFiles });
          setUploading(false);
        })
        .catch((error) => {
          console.log("Error uploading images: ", error);
          setUploading(false);
        });
    }
  };
  
  const deleteImage = (public_id) => {
    setUploading(true);
    fetch(`${process.env.API}/admin/upload/image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Фильтруем изображения, удаляем изображение с указанным public_id
        const filteredImages = updatingProduct
          ? updatingProduct.images.filter(
              (image) => image.public_id !== public_id
            )
          : product.images.filter((image) => image.public_id !== public_id);
  
        updatingProduct
          ? setUpdatingProduct({
              ...updatingProduct,
              images: filteredImages,
            })
          : setProduct({ ...product, images: filteredImages });
      })
      .catch((err) => {
        toast.error("Image delete failed");
        console.log("CLOUDINARY DELETE ERR", err);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  

  const createProduct = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json", // Add Content-Type header
        },
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        toast.success(`Product "${data?.title}" created`);
        // router.push("/dashboard/admin/products");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const response = await fetch(`${process.env.API}/product?page=${page}`, {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        setProducts(data?.products);
        setCurrentPage(data?.currentPage);
        setTotalPages(data?.totalPages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatingProduct),
          headers: {
            "Content-Type": "application/json", // Add Content-Type header
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        toast.success(`Product "${data?.title}" updated`);
        router.back();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        toast.success(`Product "${data?.title}" deleted`);
        router.back();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        products,
        setProducts,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        updatingProduct,
        setUpdatingProduct,
        uploading,
        setUploading,
        uploadImages,
        deleteImage,
        createProduct,
        fetchProducts,
        updateProduct,
        deleteProduct,
        showImagePreviewModal,
        setShowImagePreviewModal,
        currentImagePreviewUrl,
        setCurrentImagePreviewUrl,
        openImagePreviewModal,
        closeModal,
        showRatingModal,
        setShowRatingModal,
        currentRating,
        setCurrentRating,
        comment,
        setComment,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
