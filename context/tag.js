import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";

export const TagContext = createContext();

export const TagProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [updatingTag, setUpdatingTag] = useState(null);

  // Функция для создания нового тега
  const createTag = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          parentCategory,
        }),
      });

      if (response.ok) {
        toast.success("Tag created successfully");
        const newlyCreatedTag = await response.json();
        setName("");
        setParentCategory("");
        setTags([newlyCreatedTag, ...tags]);
      } else {
        const errorData = await response.json();
        toast.error(errorData.err);
      }
    } catch (err) {
      console.log("err => ", err);
      toast.error("An error occurred while creating a tag");
    }
  };

  // Функция для получения списка тегов
  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.API}/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("An error occurred while fetching tags");
    }
  };

  // Функция для обновления тега
  const updateTag = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/tag/${updatingTag._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingTag),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const updatedTag = await response.json();
      setTags((prevTags) =>
        prevTags.map((tag) => (tag._id === updatedTag._id ? updatedTag : tag))
      );
      setUpdatingTag(null);
      setParentCategory("");
      toast.success("Tag updated successfully");
    } catch (err) {
      console.log("err => ", err);
      toast.error("An error occurred while updating a tag");
    }
  };

  // Функция для удаления тега
  const deleteTag = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/tag/${updatingTag._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const deletedTag = await response.json();
      setTags((prevTags) => prevTags.filter((tag) => tag._id !== deletedTag._id));
      setUpdatingTag(null);
      setParentCategory("");
      toast.success("Tag deleted successfully");
    } catch (err) {
      console.log("err => ", err);
      toast.error("An error occurred while deleting the tag");
    }
  };

  return (
    <TagContext.Provider
      value={{
        name,
        setName,
        parentCategory,
        setParentCategory,
        tags,
        setTags,
        createTag,
        fetchTags,
        updatingTag,
        setUpdatingTag,
        updateTag,
        deleteTag,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export const useTag = () => useContext(TagContext);
