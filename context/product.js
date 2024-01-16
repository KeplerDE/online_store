"use client";
import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router"; // Используем useRouter для навигации

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // Состояния для хранения данных о продуктах и управления ими
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter(); // Получаем объект router для навигации

  const uploadImages = (e) => {
    console.log(e.target.files);
    // Загрузка изображений (метод нужно дописать)
  };

  const deleteImage = (public_id) => {
    // Удаление изображения (метод нужно дописать)
  };

  const createProduct = async () => {
    try {
      // Отправка POST-запроса для создания продукта
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data?.title}" created`);
        // Переход на другую страницу (метод нужно дописать)
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      // Отправка GET-запроса для получения продуктов
      const response = await fetch(
        `${process.env.API}/product?page=${page}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        // Установка полученных данных о продуктах
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
      // Отправка PUT-запроса для обновления продукта
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatingProduct),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        toast.success(`Product "${data?.title}" updated`);
        router.back(); // Вернуться на предыдущую страницу
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async () => {
    try {
      // Отправка DELETE-запроса для удаления продукта
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
        router.back(); // Вернуться на предыдущую страницу
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
