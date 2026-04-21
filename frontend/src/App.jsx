import './App.css'
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from "./pages/Home"
import Result from "./components/Result"
// import Footer from './components/Footer';
import Header from './components/Header';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <BrowserRouter >
      <ScrollToTop />
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resultado" element={<Result />} />
        </Routes>
      </BrowserRouter >
      {/* <Footer/> */}
      <div className="gradient-background" />
    </>
  )
}

export default App
