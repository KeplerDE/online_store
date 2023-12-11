import '../styles/globals.css';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css';
import { SessionProvider } from 'next-auth/react'; 

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
