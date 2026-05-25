import React , { useState} from 'react'
import { Link }from 'react-router-dom'
import LogoutIcon from "@mui/icons-material/Logout";
import { FRONTEND_URL, buildUrl } from "../../config/urls";

const ForgetNav = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const handleProfileClick = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const logOut = () => {
    setIsProfileDropdownOpen((prev) => !prev);
    window.location.replace(buildUrl("/login", FRONTEND_URL));
  }

  return (
    <nav className="bg-white border-b pt-3 h-[12vh] border-gray-200 sticky top-0 z-50" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link className="flex items-center" to={"/"} >
              <img src='media/images/logo.png' alt="logo" className="h-10 w-auto sm:h-12" />
            </Link>
          </div>
          <div className="relative flex items-center">
            <img onClick={handleProfileClick} src="media/images/user-logo.svg" alt="user-image" className="cursor-pointer h-8 w-8" />
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  type="button"
                  className="flex items-center w-full py-3 px-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={logOut}
                >
                  <LogoutIcon fontSize="small" className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default ForgetNav
