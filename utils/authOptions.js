import CredentialsProvider from "next-auth/providers/credentials"; 
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt"; 
import dbConnect from "@/utils/dbConnect"; 

export const authOptions = {
  session: {
    strategy: "jwt", // Используем JWT для управления сессиями
  },
  providers: [
    // Провайдер аутентификации через Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // ID клиента Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Секрет клиента Google
    }),

    // Провайдер аутентификации с использованием email и пароля
    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect(); // Подключаемся к базе данных

        const { email, password } = credentials; // Получаем email и пароль пользователя

        // Поиск пользователя в базе данных
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          throw new Error("Invalid email or password"); // Если пользователь не найден, выбрасываем ошибку
        }

        // Сверяем введенный пароль с хэшированным паролем в базе данных
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          throw new Error("Invalid email or password"); // Если пароли не совпадают, выбрасываем ошибку
        }

        // Возвращаем данные пользователя без пароля
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    // Callback вызывается при успешном входе пользователя
    async signIn({ user, account }) {
      await dbConnect();

      // Обработка пользователей, вошедших через Google
      if (account.provider === "google") {
        const { email, name, image } = user;

        // Поиск пользователя в базе данных
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
          // Если пользователь не найден, создаем новую запись
          dbUser = new User({
            name,
            email,
            image,
            password: 'google-oauth-placeholder', // Фиктивный пароль для аккаунтов Google
          });
          await dbUser.save();
        }
      }
      return true;
    },
    // Обновление JWT с данными пользователя
    jwt: async ({ token, user}) => {
      const userByEmail = await User.findOne({ email: token.email });
      userByEmail.password = undefined; // Удаление пароля из данных пользователя
      token.user = userByEmail; // Добавление данных пользователя в токен
      return token;
    },
    // Обновление сессии с данными из JWT
    session: async ({ session, token }) => {
      session.user = token.user; // Добавление данных пользователя в сессию
      return session;
    }
  },
  
  secret: process.env.NEXTAUTH_SECRET, // Секретный ключ для подписания JWT
  pages: {
    signIn: "/auth/signin", // URL страницы для входа пользователя
  },
};
