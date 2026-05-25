import React from 'react'
import { Link } from "react-router-dom"
import useAuthStatus from "./auth/useAuthStatus.js";
import { DASHBOARD_URL } from "../config/urls";


function OpenAccount() {
    const { isCheckingAuth, isAuthenticated } = useAuthStatus();
    return (  <div className='container mx-auto p-4 mb-12'>
        <div className='flex flex-col items-center text-center'>
            <h1 className='mt-12 mb-6 text-4xl font-semibold text-gray-800'>Open a StockX account</h1>
            <p className="text-xl text-gray-600 mb-8">Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
             {isCheckingAuth ? null : isAuthenticated ? (
                    <a
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg mb-12'
                        href={DASHBOARD_URL}
                    >
                        Go to Dashboard
                    </a>
                ) : (
                    <Link
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-lg mb-12'
                        to="/signup"
                    >
                        Sign Up for Free
                    </Link>
                )}
                
        </div>
        </div> );
}

export default OpenAccount;