// Filename - App.js
 
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";
import Home from "./Pages/home";
import About from "./Pages/about";
// import ProductPage from "./Pages/productPage";
import Lookbook from "./Pages/lookbook";
import Navbar from "./Components/Navbar";
import DeliveryAndReturns from "./Pages/deliveryAndReturns";
import PantsProductPage from "./Pages/pantsProductPage";
import PulloverProductPage from "./Pages/pulloverProductPage";
import TshirtProductPage from "./Pages/tshirtProductPage";
import HoodieProductPage from "./Pages/hoodieProductPage";
import PasswordModal from "./Components/PasswordModal"; // Import your modal component
import CombinedPage from "./Pages/combinedPage";
import TestingSnipcart from "./Pages/testingSnipcart";
import "./Styles/snipcart.css";

function App() {

  const [isPasswordCorrect, setIsPasswordCorrect] = useState(
      localStorage.getItem('isLoggedIn') === 'true'
    ); // Check if logged in on initial render

  const handlePasswordSubmit = (password) => {
    // const correctPassword = "test";

    const correctPassword = process.env.REACT_APP_PRESALE_PWORD; // Use REACT_APP_ prefix for better practice

    const isCorrect = password === correctPassword;

    setIsPasswordCorrect(isCorrect);
    
    localStorage.setItem('isLoggedIn', isCorrect ? 'true' : 'false'); // Set flag

    return isCorrect;
  };

  const handleQRAuthenticate = () => {
    setIsPasswordCorrect(true);
    localStorage.setItem("isLoggedIn", "true");
  };

//removed pass
  return (
    <Router>
      {/* <PasswordModal
        isOpen={!isPasswordCorrect}
        onSubmit={handlePasswordSubmit}
        onAuthenticate = {handleQRAuthenticate}
      />
      {isPasswordCorrect && ( */}
        <>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<CombinedPage />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/avery-hoodie" element={<ProductPage />} /> */}
            <Route path="/lyon-pants" element={<PantsProductPage />} />
            <Route path="/como-pullover" element={<PulloverProductPage />} />
            <Route path="/shion-tshirt" element={<TshirtProductPage />} />
            <Route path="/avery-hoodie" element={<HoodieProductPage />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/delivery-and-returns" element={<DeliveryAndReturns />} />
            <Route path="/snipcart-test" element={<TestingSnipcart />} />
          </Routes>
        </>
      {/* )} */}
      {/* {!isPasswordCorrect && <Navigate to="/" />} */}
    </Router>
  );
}

export default App;