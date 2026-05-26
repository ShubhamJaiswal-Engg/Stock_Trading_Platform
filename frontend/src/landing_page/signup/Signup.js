import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { ToastContainer, toast } from "react-toastify";
import { AUTH_STATUS_KEY, BACKEND_URL, DASHBOARD_URL, buildUrl } from "../../config/urls";
function Signup() {
  const [isLoading,setIsLoading ] = useState(false)
  const [inputValue, setInputValue] = useState({
    email:"",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-center",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
    });

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{2,20}$/; // Alphanumeric, 3-20 chars
    if (!username) {
      handleError("Please enter Username.");
      return false;
    }
    if (!usernameRegex.test(username)) {
      handleError("Username must be letters, numbers, or underscores.");
      return false;
    }
    if (!email) {
      handleError("Please enter a email address.");
      return false;
    }
    if (!emailRegex.test(email)) {
      handleError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      handleError("Please enter password.");
      return false;
    }
    if (password.length < 6) {
      handleError("Password must be at least 6 characters long.");
      return false;
    }
    // Optionally, add more password checks: at least one number, one letter, etc.
    // if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    //   handleError("Password must contain at least one letter and one number.");
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    if(isLoading) return;
    setIsLoading(true)
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/signup`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          localStorage.setItem(AUTH_STATUS_KEY || "authStatus", "authed");
          // It will save on same tab
          // localStorage.setItem("authStatus", "authed");
          window.location.replace(buildUrl("/?signup=true", DASHBOARD_URL));
        }, 2000);
       return; //Keep active loader until redirect
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
    setTimeout(() =>{
        setInputValue({
              ...inputValue,
              email: "",
              password: "",
    });
    },2500);
  };
  return (
    <div className="container mx-auto p-4 md:p-12 mt-12 mb-24">
      <div className="flex flex-col items-center mb-16 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 mb-6 text-center leading-tight">
            Open a free demat and trading account online
          </h1>
          <h4 className="text-lg md:text-xl text-gray-500 text-center">
            Start investing brokerage free and join a community of 1.5+ crore
            investors and traders
          </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto items-center">
        <div className="flex justify-center">
          <img src="media/images/account_open.svg" alt="Signup" className="w-4/5 md:w-full" />
        </div>
        <div className="flex justify-center md:justify-start">
          <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md space-y-2 px-4 md:px-0">
            <h1 className="text-3xl font-medium text-gray-800">Signup now</h1>
            <p className="text-gray-500 mb-4">Or track your existing application</p>

            <div className="relative">
            <PersonIcon fontSize="small" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleOnChange}
              className="w-full pl-10 pr-2 py-2.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            </div>
            <div className="relative">
            <EmailIcon fontSize="small" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
             <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={handleOnChange}
              className="w-full pl-10 pr-2 py-2.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            </div>
            <div className="relative">
            <LockIcon fontSize="small" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleOnChange}
              className="w-full pl-10 pr-2 py-2.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            </div>
            <button disabled={isLoading} type="submit" className={`w-full bg-blue-500  text-white font-semibold py-2.5 px-4 rounded text-lg transition duration-200 mt-2 ${ 
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
             }`}>
               <span className="inline-flex items-center justify-center gap-2">
                {isLoading && <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />}
                {isLoading ? "Signing Up..." : "SignUp"}
              </span>
            </button>
            <div className="text-gray-600 mt-4 text-center md:text-left">
              <span>If you have an existing account? </span>
              <Link to={"/login"} className="text-blue-500 hover:text-blue-700 text-lg hover:underline font-medium">Login</Link>
            </div>
            <Link className="flex justify-center items-center text-blue-500 text-lg hover:underline hover:text-blue-700" to={"/forget-password"}>Forgotten password?</Link>      
            
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Signup;
