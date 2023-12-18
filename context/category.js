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
