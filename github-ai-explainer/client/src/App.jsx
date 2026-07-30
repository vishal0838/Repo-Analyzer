import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import  "./App.css";
import Hero from './components/Hero';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen w-full flex-col bg-gray-900">
        <Navbar />
        <Hero />
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;
