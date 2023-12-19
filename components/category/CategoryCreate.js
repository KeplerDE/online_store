// Импорт хука контекста для работы с категориями
import { useCategory } from "@/context/category";

export default function AdminCreateCategory() {
    // Использование контекста для получения и установки состояний и функций
    const {
        name,
        setName,
        updatingCategory,
        setUpdatingCategory,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategory();

    return (
        <>
            <p>Create Category</p>
            {/* Поле ввода для названия категории */}
            <input
                type="text"
                value={updatingCategory ? updatingCategory.name : name}
                onChange={(e) =>
                    updatingCategory
                        ? setUpdatingCategory({ ...updatingCategory, name: e.target.value })
                        : setName(e.target.value)
                }
                className="form-control p-2 my-2"
            />

        </>
    );
}
