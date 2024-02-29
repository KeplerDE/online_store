import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css';
import { SessionProvider } from 'next-auth/react';
import Loading from '../components/Loading'; 
import RootLayout from '../components/RootLayout'; // Импортируем RootLayout
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Подписываемся на события маршрутизации
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Отписываемся от событий при размонтировании компонента
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <SessionProvider session={pageProps.session}>
      <SnackbarProvider maxSnack={3}> {/* Оборачиваем в SnackbarProvider */}
        {loading && <Loading />}
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </SnackbarProvider>
    </SessionProvider>
  );
}

export default MyApp;
