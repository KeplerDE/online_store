import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Online store',
  description: 'Ecommerce Website using NextJS Fullstack',
};

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Toaster /> 
      <main>{children}</main>
    </>
  );
}
