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

        // Проверяем пароль пользователя
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
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      if (account.provider === "google") {
        const { email, name, image } = user;

        let dbUser = await User.findOne({ email });
        if (!dbUser) {
          // 
          dbUser = new User({
            name,
            email,
            image,
            password: 'google-oauth-placeholder', // Фиктивный пароль
          });
          await dbUser.save();
        }
      }
      return true;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET, // Секретный ключ для подписи сессии
  pages: {
    signIn: "/auth/signin", // URL страницы для входа
  },
};
