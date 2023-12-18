// context/category.js

// Использование на стороне клиента
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
  
  // Функция для получения всех категорий
  const fetchCategories = async () => {
    try {
      // Логика получения категорий...
    } catch (error) {
      // Обработка ошибок и вывод сообщения
      console.error("Ошибка при получении категорий:", error);
    }
  };

  // Функция для обновления категории
  const updateCategory = async () => {
    try {
      // Логика обновления категории...
    } catch (err) {
      // Обработка ошибок и вывод сообщения
      console.log("err => ", err);
      toast.error("Произошла ошибка при обновлении категории");
    }
  };

  // Функция для удаления категории
  const deleteCategory = async () => {
    try {
      // Логика удаления категории...
    } catch (err) {
      // Обработка ошибок и вывод сообщения
      console.log("err => ", err);
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

// Хук для использования контекста
export const useCategory = () => useContext(CategoryContext);
// context/category.js

// Использование на стороне клиента
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
      // Логика создания категории...
    } catch (err) {
      // Обработка ошибок и вывод сообщения
      console.log("err => ", err);
      toast.error("Произошла ошибка при создании категории");
    }
  };

  // Функция для получения всех категорий
  const fetchCategories = async () => {
    try {
      // Логика получения категорий...
    } catch (error) {
      // Обработка ошибок и вывод сообщения
      console.error("Ошибка при получении категорий:", error);
    }
  };

  // Функция для обновления категории
  const updateCategory = async () => {
    try {
      // Логика обновления категории...
    } catch (err) {
      // Обработка ошибок и вывод сообщения
      console.log("err => ", err);
      toast.error("Произошла ошибка при обновлении категории");
    }
  };

  // Функция для удаления категории
  const deleteCategory = async () => {
    try {
      // Логика удаления категории...
    } catch (err) {
      // Обработка ошибок и вывод сообщения
      console.log("err => ", err);
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
