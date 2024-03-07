"use client"; 
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; 
import { usePathname, useSearchParams } from "next/navigation"; 
import Pagination from "@/components/product/Pagination";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]); // Стейт для хранения списка заказов
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц
  const pathname = usePathname(); // Путь текущей страницы
  const searchParams = useSearchParams(); // Параметры поиска в URL
  const page = searchParams.get("page"); // Получаем номер страницы из URL
  console.log("current page => ", page); // Логируем номер текущей страницы

  useEffect(() => {
    fetchOrders(page); // Загружаем заказы при изменении страницы
  }, [page]); // Зависимость от номера страницы

  // Функция для получения заказов с сервера
  const fetchOrders = async (page) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/orders?page=${page}`, // Запрос к API для получения заказов
        {
          method: "GET", // Метод HTTP запроса
        }
      );
      const data = await response.json(); // Парсинг JSON ответа
      // Устанавливаем полученные данные в стейт
      setOrders(data.orders);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error); // В случае ошибки логируем её
      toast.error(error); // Показываем уведомление с ошибкой
    }
  };

  // Функция для изменения статуса заказа
  const handleStatusChange = async (newStatus, orderId) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/orders/${orderId}`, // Запрос к API для обновления заказа
        {
          method: "PUT", // Метод HTTP запроса
          headers: {
            "Content-Type": "application/json", // Тип содержимого запроса
          },
          body: JSON.stringify({ delivery_status: newStatus }), // Тело запроса с новым статусом
        }
      );
      if (response.ok) {
        // Обновляем статус заказа локально, если запрос успешен
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId ? { ...o, delivery_status: newStatus } : o
          )
        );
        toast.success("Order status updated successfully"); // Уведомление об успехе
      } else {
        toast.error("Failed to update order status"); // Уведомление об ошибке
      }
    } catch (error) {
      console.error("Error updating order status:", error); // Логирование ошибки
      toast.error("An error occurred while updating order status"); // Уведомление об ошибке
    }
  };

  // Компонент отображения заказов и пагинации
  return (
    <div className="container mb-5">
      {/* Перебор и отображение заказов */}
      {/* ... Тут расположен код отображения информации о заказах ... */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname={pathname}
      />
    </div>
  );
}
