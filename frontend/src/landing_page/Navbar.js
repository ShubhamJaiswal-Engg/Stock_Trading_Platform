import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import useAuthStatus from "./auth/useAuthStatus";
import axios from 'axios'
import { BACKEND_URL, DASHBOARD_URL, FRONTEND_URL, buildUrl } from "../config/urls";

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCheckingAuth, isAuthenticated } = useAuthStatus();
  const location = useLocation();

  const handleMenuClick = () => {
    setIsMobileMenuOpen(false);
  };
  const logOut = async () => {
    try {
      // Token cookie is httpOnly, so it must be cleared by the server.
      await axios.post(
        `${BACKEND_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (e) {
      // Even if the request fails, still clear local state and redirect.
      console.error(e);
    } finally {
      window.location.replace(buildUrl("/signup", FRONTEND_URL));
    }
  };

  const menuClass = "text-gray-500 hover:text-blue-500 transition-colors duration-200";
  const activeMenuClass = "text-blue-500";

  return ( 
  <nav className="bg-white border-b pt-3 h-[12vh] border-gray-200 sticky top-0 z-50" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link className="flex items-center" to={"/"} >
              <img src='media/images/logo.png' alt="logo" className="h-10 w-auto sm:h-12" />
            </Link>
          </div>
          <div className="flex items-center lg:hidden">
            <button 
              className="text-gray-500 hover:text-gray-900 focus:outline-none" 
              type="button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          <div className={`${isMobileMenuOpen ? "block absolute top-20 border-t-2 left-0 w-full bg-white shadow-lg p-10" : "hidden"} lg:flex lg:items-center lg:space-x-8 lg:static lg:w-auto lg:shadow-none lg:p-0`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-4 lg:space-y-0">
              <Link className="block" to={"/"} onClick={handleMenuClick} ><div className={location.pathname === "/" ? activeMenuClass : menuClass}>Home</div></Link>

              {isCheckingAuth ? null : isAuthenticated ? (
                <a
                  className="block text-red-500"
                  href={DASHBOARD_URL}
                  onClick={handleMenuClick}
                >
                  <div className={`${menuClass} text-red-600 hover:text-red-600`}>Dashboard</div>
                </a>
              ) : (
                <Link
                  className="block"
                  to={"/signup"}
                  onClick={handleMenuClick}
                >
                  <div className={(location.pathname === "/signup" || location.pathname === "/login") ? activeMenuClass : menuClass}>SignUp</div>
                  {/* <div className={ ? activeMenuClass : menuClass}>SignUp</div> */}
                </Link>
              )}
              
              <Link className="block" to={"/about"} onClick={handleMenuClick} ><div className={location.pathname === "/about" ? activeMenuClass : menuClass}>About</div></Link>
              
              <Link className="block" to={"/product"} onClick={handleMenuClick} ><div className={location.pathname === "/product" ? activeMenuClass : menuClass}>Products</div></Link>
              
              <Link className="block" to={"/pricing"} onClick={handleMenuClick} ><div className={location.pathname === "/pricing" ? activeMenuClass : menuClass}>Pricing</div></Link>
              
              <Link className="block" to={"/support"} onClick={handleMenuClick} ><div className={location.pathname === "/support" ? activeMenuClass : menuClass}>Support</div></Link>
             {isCheckingAuth ? null : isAuthenticated ? 
              <Link className="block" onClick={logOut}  ><p className="text-gray-500 hover:text-red-500 ">Log out</p></Link> : ''
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;