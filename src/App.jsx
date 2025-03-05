import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header"; 
// import Footer from "./components/Footer/Footer"; 
// import Home from "./components/Home/Home";
// import Signup from "./components/Signup/Signup";
// import Login from "./components/Login/Login";
// import ClimateTroopers from "./components/Services/ClimateTroopers";
// import Project8 from "./components/Projects/Project8";
// import Gallery from "./components/Gallery/Gallery";
// import Events from "./components/Events/Events";
// import PrivateRoute from "./components/PrivateRoutes/PrivateRoutes";
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />

          <main>
            <Routes>
              {/* <Route path="/" element={<Home />} />  */}
              {/* <Route path="/Gallery" element={<Gallery />} />  */}
              {/* <Route 
                path="/Events" 
                element={
                  <PrivateRoute>
                    <Events /> 
                  </PrivateRoute>
                } 
              /> */}
              {/* <Route path="/Login" element={<Login />} /> 
              <Route path="/Signup" element={<Signup />} /> */}
              {/* <Route path="/Services/ClimateTroopers" element={<ClimateTroopers />} />   */}
              {/* <Route path="/Projects/Project8" element={<Project8 />} /> */}
            </Routes>
          </main>

          {/* <Footer /> */}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
