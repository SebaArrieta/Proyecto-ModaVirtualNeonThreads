
import "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <Navbar/>
      <div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Product" element={<ProductDetail />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </div>
    </>
  );
}

export default App;