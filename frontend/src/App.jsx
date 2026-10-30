import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CheckoutPage from './Pages/payments/CheckoutPage';
import MyOrdersPage from './Pages/payments/MyOrdersPage';
import PaymentSuccessPage from './Pages/payments/PaymentSuccessPage';
import PaymentCancelledPage from './Pages/payments/PaymentCancelledPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="checkout/cancel" element={< PaymentCancelledPage />} />
        <Route path="checkout/success" element={<PaymentSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
