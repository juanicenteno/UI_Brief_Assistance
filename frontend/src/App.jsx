import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from "./pages/Home"
import Result from "./components/Result"
// import Footer from './components/Footer';
import Header from './components/Header';
function App() {
  return (
    <>
      <BrowserRouter >
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
