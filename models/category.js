// models/category.js
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Определение схемы категории с требованиями к полям
const categorySchema = new mongoose.Schema({
  name: {
    type: String,      // Указываем, что тип данных поля 'name' должен быть строкой
    trim: true,        // Удаляет пробелы по краям строки
    required: true,    // Поле 'name' обязательно для заполнения
    minLength: 1,      // Минимальная длина строки - 1 символ
    maxLength: 20,     // Максимальная длина строки - 20 символов
  },
  slug: {
    type: String,      // Тип данных поля 'slug' - строка
    unique: true,      // Значение поля 'slug' должно быть уникальным в коллекции
    lowercase: true,   // Преобразование значения поля 'slug' в нижний регистр
    index: true,       // Создание индекса для поля 'slug' для ускорения поиска
  },
}, {
  timestamps: true    // Автоматическое добавление полей 'createdAt' и 'updatedAt'
});

// Использование плагина uniqueValidator для добавления предварительной проверки уникальности значений
categorySchema.plugin(uniqueValidator);

// Экспорт модели 'Category', если она уже существует, или создание новой модели с помощью 'categorySchema'
export default mongoose.models.Category || mongoose.model('Category', categorySchema);

