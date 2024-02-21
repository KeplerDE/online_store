import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import { CategoryProvider } from "@/context/category";
import { SessionProvider } from 'next-auth/react';
import { TagProvider } from "@/context/tag";
import { ProductProvider } from '@/context/product';
import { CartProvider } from '@/context/cart';

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <CategoryProvider>
        <TagProvider>
          <ProductProvider>
            <CartProvider>
                <Toaster /> 
                <Navbar />
                <main>{children}</main>
            </CartProvider>
          </ProductProvider>
        </TagProvider>
      </CategoryProvider>
    </SessionProvider>
  );
}
