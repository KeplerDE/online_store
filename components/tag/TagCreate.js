"use client";
import { useTag } from "@/context/tag";
import { useCategory } from "@/context/category";
import { useEffect } from "react";

export default function AdminTagCreate() {
  // Использование контекста для работы с тегами
  const {
    name,
    setName,
    parentCategory,
    setParentCategory,
    updatingTag,
    setUpdatingTag,
    createTag,
    updateTag,
    deleteTag,
  } = useTag();

  // Использование контекста для работы с категориями
  const { fetchCategories, categories } = useCategory();

  // Загрузка списка категорий при монтировании компонента
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <p>Create tag</p>
      <input
        type="text"
        value={updatingTag ? updatingTag.name : name}
        placeholder="Tag Name"
        onChange={(e) => updatingTag ? setUpdatingTag({ ...updatingTag, name: e.target.value }) : setName(e.target.value)}
        className="form-control p-2 my-2"
      />
      <div className="form-group mt-4">
        <label>Parent category</label>
        <select
          name="category"
          className="form-control"
          value={updatingTag ? updatingTag.parentCategory : parentCategory}
          onChange={(e) => updatingTag ? setUpdatingTag({ ...updatingTag, parentCategory: e.target.value }) : setParentCategory(e.target.value)}
        >
          <option value="">Select one</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className={`btn ${updatingTag ? "btn-info" : "btn-primary"} text-light`}
          onClick={(e) => {
            e.preventDefault();
            updatingTag ? updateTag() : createTag();
          }}
        >
          {updatingTag ? "Update" : "Create"}
        </button>
        {updatingTag && (
          <>
            <button
              className="btn btn-danger text-light"
              onClick={(e) => {
                e.preventDefault();
                deleteTag();
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-success text-light"
              onClick={() => setUpdatingTag(null)}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </>
  );
}
