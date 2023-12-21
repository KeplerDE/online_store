import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import { CategoryProvider } from "@/context/category";
import { SessionProvider } from 'next-auth/react';
import { TagProvider } from "@/context/tag";

export default function RootLayout({ children }) {
  return (
    <CategoryProvider>
      <TagProvider>
      <Head>
        {/* Сюда помещаются элементы, предназначенные для <head> */}
        <title>Online store</title>
        <meta name="description" content="Ecommerce Website using NextJS Fullstack" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* Другие мета-теги, стили, скрипты и т.д. */}
      </Head>
      {/* Основное содержимое страницы */}
      <Toaster /> 
      <Navbar />
      <main>{children}</main>
      </TagProvider>
    </CategoryProvider>
  );
}
