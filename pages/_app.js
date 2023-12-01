// pages/_app.js
import '../styles/globals.css';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
