import React from 'react'
import { Link } from "react-router-dom";
import useAuthStatus from "../auth/useAuthStatus";
import { DASHBOARD_URL } from "../../config/urls";

function Hero() {
    const { isCheckingAuth, isAuthenticated } = useAuthStatus();

    return ( 
        <div className='container mx-auto p-4 pb-0'>
            <div className='flex flex-col items-center text-center'>
                <img src='media/images/homeHero.png' alt='Home Page' className="mb-8" />
                <h1 className='mt-12 text-4xl font-semibold text-gray-800 mb-2'>Invest in everything</h1>
                <p className="text-xl text-gray-600 mb-8">Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
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
            </div>
 );
}

export default Hero;