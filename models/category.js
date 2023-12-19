// models/category.js
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Определение схемы категории
const categorySchema = new mongoose.Schema(
  {

    name: {
      type: String,      // Тип данных - строка
      trim: true,        // Удаление пробелов в начале и конце строки
      required: true,    // Обязательное поле
      minLength: 1,      // Минимальная длина - 1 символ
      maxLength: 20,     // Максимальная длина - 20 символов
    },
    // Поле 'slug' для уникального идентификатора категории
    slug: {
      type: String,      // Тип данных - строка
      unique: true,      // Уникальное значение
      lowercase: true,   // Преобразование в нижний регистр
      index: true,       // Индексация для оптимизации запросов
    },
  },
  { timestamps: true }   // Включение временных меток для отслеживания создания и обновления
);

// Применение плагина uniqueValidator для обеспечения уникальности полей
categorySchema.plugin(uniqueValidator);


export default mongoose.models.Category || mongoose.model('Category', categorySchema);
