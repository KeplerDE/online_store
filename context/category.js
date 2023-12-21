"use client";
import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";

// Создание контекста для категорий
export const CategoryContext = createContext();

// Провайдер контекста
export const CategoryProvider = ({ children }) => {
  // Состояние для имени текущей категории
  const [name, setName] = useState("");

  // Состояние для хранения всех категорий
  const [categories, setCategories] = useState([]);

  // Состояние для обновления и удаления категории
  const [updatingCategory, setUpdatingCategory] = useState(null);

  // Функция для создания новой категории
  const createCategory = async () => {
    try {
      // Отправляем POST-запрос на сервер для создания новой категории
      const response = await fetch(`${process.env.API}/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, // Данные новой категории
        }),
      });
  
      // Проверяем, успешно ли был обработан запрос
      if (response.ok) {

        toast.success("Категория успешно создана");
        // Получаем данные только что созданной категории
        const newlyCreatedCategory = await response.json();
        // Очищаем поле ввода
        setName("");
        // Обновляем список категорий, добавляя новую категорию
        setCategories([newlyCreatedCategory, ...categories]);
      } else {
        // Если запрос не успешен, получаем данные об ошибке
        const errorData = await response.json();
        // Выводим сообщение об ошибке
        toast.error(errorData.err);
      }
    } catch (err) {
      // Логируем ошибку в консоль
      console.log("err => ", err);
      // Выводим сообщение об ошибке при создании категории
      toast.error("Произошла ошибка при создании категории");
    }
  };
  
  const fetchCategories = async () => {
    try {
      const apiUrl = `${process.env.API}/admin/category`;
      console.log(`Запрос к API: ${apiUrl}`); // Логируем URL запроса
  
      const response = await fetch(apiUrl);
  
      console.log(`Статус ответа: ${response.status}`); // Логируем статус ответа
  
      if (!response.ok) {
        const responseBody = await response.text(); // Получаем текст ответа для диагностики
        console.error(`Тело ответа: ${responseBody}`);
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Ошибка при получении категорий:", error);
    }
  };
  

const updateCategory = async () => {
    try {
      // Выполняем PUT-запрос к серверу для обновления категории
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingCategory), // Данные категории для обновления
        }
      );
  
      // Проверяем статус ответа сервера
      if (!response.ok) {
        // Если статус не 'ok', генерируем исключение
        throw new Error("Network response was not ok");
      }
  
      // Получаем обновленные данные категории из ответа сервера
      const updatedCategory = await response.json();
  
      // Обновляем состояние категорий, заменяя обновленную категорию
      setCategories((prevCategories) =>
        prevCategories.map((c) =>
          c._id === updatedCategory._id ? updatedCategory : c
        )
      );
  
      // Очищаем состояние текущей обновляемой категории
      setUpdatingCategory(null);
  
      // Отображаем сообщение об успешном обновлении
      toast.success("Категория успешно обновлена");
    } catch (err) {
      // В случае ошибки выводим её в консоль
      console.log("err => ", err);
  
      // Отображаем сообщение об ошибке
      toast.error("Произошла ошибка при обновлении категории");
    }
  };
  

  // Функция для удаления категории


const deleteCategory = async () => {
    try {
      // Выполняем DELETE-запрос к серверу для удаления категории
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory._id}`, // Путь запроса включает идентификатор удаляемой категории
        {
          method: "DELETE", // Метод HTTP для удаления
        }
      );
  
      // Проверяем статус ответа сервера
      if (!response.ok) {
        // Если статус не 'ok', генерируем исключение
        throw new Error("Network response was not ok");
      }
  
      // Получаем данные удаленной категории из ответа сервера
      const deletedCategory = await response.json();
  
      // Удаляем категорию из состояния, фильтруя массив категорий
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c._id !== deletedCategory._id)
      );
  
      // Очищаем состояние текущей обновляемой категории
      setUpdatingCategory(null);
  
      // Отображаем сообщение об успешном удалении
      toast.success("Категория успешно удалена");
    } catch (err) {
      // В случае ошибки выводим её в консоль
      console.log("err => ", err);
  
      // Отображаем сообщение об ошибке
      toast.error("Произошла ошибка при удалении категории");
    }
  };

  // Предоставление состояния и функций через контекст
  return (
    <CategoryContext.Provider
      value={{
        name,
        setName,
        createCategory,
        categories,
        setCategories,
        fetchCategories,
        updatingCategory,
        setUpdatingCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};


export const useCategory = () => useContext(CategoryContext);
