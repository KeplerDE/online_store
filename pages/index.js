import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <main className="container mt-4">
        <h1>Welcome to My Ecommerce Site</h1>
        {/* Add more content here */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
