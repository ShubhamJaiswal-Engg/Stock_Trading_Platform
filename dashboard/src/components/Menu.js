import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import GeneralContext from "./GeneralContext";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL, buildUrl } from "../config/urls";

const Menu = ({ pageTitle = "Dashboard" }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  // const [mobileWatchList, setMobileWatchList] = useState(false);


  const context = useContext(GeneralContext);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  const handleMenuClick = (index) => {
    // console.log(mobileWatchList)
    setSelectedMenu(index);
  };

  const handleMobileNavLinkClick = (index) => {
    handleMenuClick(index);
    closeMobileNav();
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };
  const menuClass = "menu";
  const activeMenuClass = "menu selected";
  useEffect(() => {
    const onDocumentClick = (e) => {
      if (!isProfileDropdownOpen) return;
      if (!e.target.closest("#profile-wrapper")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileNavOpen]);

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
      localStorage.removeItem("username");
      sessionStorage.removeItem("dashboard_welcome_shown");
      window.location.replace(buildUrl("/", FRONTEND_URL));
    }
  };

  const avatarText =
    context.userName && context.userName.length >= 2
      ? context.userName[0].toUpperCase() +
        context.userName[context.userName.length - 1].toUpperCase()
      : "U";

  return (
    <div className="menu-container">
      <img src="logo.png" alt="StockX" className="menu-logo" />
      <div className="mobile-page-title">{pageTitle}</div>

      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>

        <div className="profile-wrapper" id="profile-wrapper">
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">{avatarText}</div>
            <p className="username">{context.userName}</p>
            <span className="profile-caret">
              {isProfileDropdownOpen ? (
                <KeyboardArrowUpIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
            </span>
          </div>

          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-dropdown-name">{context.userName}</div>
                {context.userEmail ? (
                  <div className="profile-dropdown-email">{context.userEmail}</div>
                ) : null}
              </div>

              <div className="profile-dropdown-divider" />

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={logOut}
              >
                <LogoutIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isMobileNavOpen ? (
        <button
          type="button"
          className="nav-overlay"
          aria-label="Close navigation"
          onClick={closeMobileNav}
        />
      ) : null}

      <aside
        className={
          isMobileNavOpen ? "mobile-drawer pl-4 pr-4 sm:pl-6 sm:pr-6 mobile-drawer--open mobile-drawer--openn" : "mobile-drawer"
        }
        aria-hidden={!isMobileNavOpen}
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-profile">
            {/* <div className="profile-wrapper" id="profile-wrapper"> */}
          <div className="profile">
            <div className="avatar">{avatarText}</div>
            {/* <div className="avatar">{avatarText}</div> */}
            <div>
              <div className="mobile-drawer-name">{context.userName}</div>
              {context.userEmail ? (
                <div className="mobile-drawer-email">{context.userEmail}</div>
              ) : null}
            </div>
            </div>
          </div>

          <button
            type="button"
            className="mobile-drawer-close"
            aria-label="Close navigation"
            onClick={closeMobileNav}
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <Link
            to="/marketwatch"
            className="mobile-drawer-link"
            onClick={() => handleMobileNavLinkClick(0)}
          >
            Marketwatch
          </Link>
          <Link
            to="/"
            className="mobile-drawer-link"
            onClick={() => handleMobileNavLinkClick(1)}
          >
            Dashboard
          </Link>
          <Link
            to="/orders"
            className="mobile-drawer-link"
            onClick={() => handleMobileNavLinkClick(2)}
          >
            Orders
          </Link>
          <Link
            to="/holdings"
            className="mobile-drawer-link"
            onClick={() => handleMobileNavLinkClick(3)}
          >
            Holdings
          </Link>
          <Link
            to="/positions"
            className="mobile-drawer-link"
            onClick={() => handleMobileNavLinkClick(4)}
          >
            Positions
          </Link>
          <Link
            to="/funds"
            className="mobile-drawer-link"
            onClick={() => handleMobileNavLinkClick(5)}
          >
            Funds
          </Link>
          <Link
            to="/apps"
            className="mobile-drawer-link"
            onClick={() => handleMobileNavLinkClick(6)}
          >
            Apps
          </Link>
        </nav>

        <div className="mobile-drawer-footer">
          <button
            type="button"
            className="mobile-drawer-logout"
            onClick={logOut}
          >
            <LogoutIcon fontSize="small" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <button
        type="button"
        className="menu-toggle"
        aria-label="Open navigation"
        aria-expanded={isMobileNavOpen}
        onClick={() => setIsMobileNavOpen(true)}
      >
        <MenuIcon fontSize="medium" />
      </button>
    </div>
  );
};

export default Menu;