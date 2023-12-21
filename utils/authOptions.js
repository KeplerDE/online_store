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
    async signIn({ user, account }) {
      await dbConnect();

      if (account.provider === "google") {
        const { email, name, image } = user;
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
          dbUser = new User({
            name,
            email,
            image,
            password: 'google-oauth-placeholder',
          });
          await dbUser.save();
        }
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        const userByEmail = await User.findOne({ email: user.email });
        userByEmail.password = undefined;
        token.user = userByEmail;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    }
  },
  
  secret: process.env.NEXTAUTH_SECRET, 
  pages: {
    signIn: "/auth/signin",
  },
};
