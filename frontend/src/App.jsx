import React from 'react';
import './App.css'
import Navbar from './Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Categories from './Categories'
import ProductView from './ProductView';
import Paymentcheckout from './Paymentcheckout';
import ConfirmOrder from './ConfirmOrder';
import OrderSuccess from './OrderSuccess';
import Cover from './Cover';
import CoverFooter from './CoverFooter';
import Login from './Login';
import Cart from './Cart';
import Address from './Address';
import { AuthProvider } from './AuthContext'; // Import the provider
import PhoneLogin from './Phone';
import Addbook from './Addbook';
import Navbar2 from './Navbar2';
import Orders from './Orders';
import EditBook from './Editbook';
import Exam from './Exam'
import { Toaster } from 'react-hot-toast';
import ContactUs from './ContactUs';
import TnC from './TnC'
import CancellationPolicy from './CancellationPolicy';
import ShippingPolicy from './ShippingPolicy';
import PrivacyPolicy from './PrivacyPolicy';
import ProtectedRoute from './ProtectedRoute'
import AccountPage from './AccountPage'
import WriteReview from './WriteReview'

function App() {


  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <div>
                <Navbar />
                <Categories />
                <Cover />
                <CoverFooter />
              </div>
            } />
            <Route path="/login" element={
              <Login />
            } />

            <Route path="/exam" element={
              <div>
                <Navbar2 />
                <Exam />
              </div>
            } />

            <Route path="/book/:bookId" element={
              <div>
                <Navbar2 />
                <ProductView />
              </div>
            } />
            <Route path="/book/:bookId/payment" element={
              <Paymentcheckout />
            } />
            <Route path="/checkout/:bookId" element={
              <ProtectedRoute>
                <ConfirmOrder />
              </ProtectedRoute>
            } />
            <Route path="/ordersuccessful" element={
              <OrderSuccess />
            } />

            <Route path="/cart" element={
              <div>
                <Navbar />
                <Cart />
              </div>
            } />

            <Route path="/address" element={
              <div>
                <Navbar />
                <Address />
              </div>
            } />

            <Route path="/Loginwithphone" element={
              <PhoneLogin />
            } />

            <Route path="/Addbookonlyforadmin" element={
              <Addbook />
            } />
            <Route path="/Alterbookonlyforadmin" element={
              <EditBook />
            } />

            <Route path="/orders" element={
              <div>
                <Navbar2 />
                <Orders />
              </div>
            } />

            <Route path="/Contactus" element={
              <ContactUs />
            } />

            <Route path="/TermsAndConditions" element={
              <TnC />
            } />

            <Route path="/CancellationPolicy" element={
              <CancellationPolicy />
            } />

            <Route path="/ShippingPolicy" element={
              <ShippingPolicy />
            } />

            <Route path="/PrivacyPolicy" element={
              <PrivacyPolicy />
            } />

            <Route path="/Account" element={
              <AccountPage />
            } />

            <Route
              path="/write-review/:orderId"
              element={
                <ProtectedRoute>
                  <WriteReview />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
