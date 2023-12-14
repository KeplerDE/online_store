import CredentialsProvider from "next-auth/providers/credentials"; 
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt"; 
import dbConnect from "@/utils/dbConnect"; 

export const authOptions = {
  session: {
    strategy: "jwt", // Используем JWT для сессии
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect(); // Подключаемся к базе данных

        const { email, password } = credentials; // Получаем email и пароль из переданных учетных данных
        
        // Поиск пользователя по email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          throw new Error("Invalid email or password"); // Если пользователь не найден, бросаем ошибку
        }

        // Проверяем, есть ли у пользователя пароль (проверка на случай, если регистрация была через соцсеть)
        if (!user.password) {
          throw new Error("Пожалуйста, войдите тем способом, который вы использовали при регистрации");
        }

        // Сверяем предоставленный пароль с хэшированным паролем из базы данных
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          throw new Error("Invalid email or password"); // Если пароли не совпадают, бросаем ошибку
        }

        // Возвращаем объект пользователя без пароля
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Секретный ключ для подписи сессии, должен быть задан в переменных окружения
  pages: {
    signIn: "/auth/signin", // URL страницы для входа
  },

};
