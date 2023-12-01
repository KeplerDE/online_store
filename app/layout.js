// RootLayout.js
import React from 'react';
import Head from 'next/head';

export const metadata = {
  title: 'Create Next App',
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
        {/* Add any other head tags here */}
      </Head>
      <main>{children}</main>
    </>
  );
}
