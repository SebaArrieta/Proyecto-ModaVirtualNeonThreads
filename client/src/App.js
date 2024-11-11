
import "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AddProduct from "./components/AddProduct";
import Cart from "./components/Cart";
import Payments from "./components/Payments";
import OrderSummary from "./components/OrderSummary";
import Cart from "./components/Cart";
import Payments from "./components/Payments";
import OrderSummary from "./components/OrderSummary"

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
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Payments" element={<Payments />} />
            <Route path="/OrderSummary" element={<OrderSummary />} />
        </Routes>
      </div>
    </>
  );
}

export default App;