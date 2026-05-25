import React from "react";
import { Link } from 'react-router-dom'
import useAuthStatus from "../auth/useAuthStatus";
import { DASHBOARD_URL } from "../../config/urls";
function Universe() {
 const { isCheckingAuth, isAuthenticated } = useAuthStatus();
  return (
    <div className="container mx-auto p-4 md:p-12 mb-16">
      <div className="flex flex-col items-center mt-12 mb-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">The StockX Universe</h1>
          <h4 className="text-lg text-gray-600 mb-8">
            Extend your trading and investment experience even further with our
            partner platforms
          </h4>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center p-4">
          <img
            className="w-1/2 mb-6"
            alt="logo"
            src="media/images/stockxfundhouse.png"
          />
          <p className="text-gray-500 text-sm">
            Our asset management venture
            <br className="hidden md:block"/> that is creating simple and transparent index <br className="hidden md:block"/>
            funds to help you save for your goals.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <img
            className="w-3/5 mb-6"
            alt="logo"
            src="media/images/sensibullLogo.svg"
          />
          <p className="text-gray-500 text-sm">
            Options trading platform that lets you <br className="hidden md:block"/>
            create strategies, analyze positions, and examine <br className="hidden md:block"/> data points
            like open interest, FII/DII, and more.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <img
            className="w-2/5 mb-6"
            alt="logo"
            src="media/images/tijori.svg"
          />
          <p className="text-gray-500 text-sm">
            Investment research platform <br className="hidden md:block"/>
            that offers detailed insights on stocks, <br className="hidden md:block"/> sectors, supply
            chains, and more.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <img
            className="w-2/5 mb-6"
            alt="logo"
            src="media/images/streakLogo.png"
          />
          <p className="text-gray-500 text-sm">
            Systematic trading platform <br className="hidden md:block"/> that allows you to create and backtest<br className="hidden md:block"/>
            strategies without coding.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <img
            className="w-1/2 mb-6"
            alt="logo"
            src="media/images/smallcaseLogo.png"
          />
          <p className="text-gray-500 text-sm">
            Thematic investing platform<br className="hidden md:block"/> that helps you invest in diversified<br className="hidden md:block"/>
            baskets of stocks on ETFs.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <img
            className="w-2/5 mb-6"
            alt="logo"
            src="media/images/ditto-logo.png"
          />
          <p className="text-gray-500 text-sm">
            Personalized advice on life<br className="hidden md:block"/> and health insurance. No spam<br className="hidden md:block"/> and no
            mis-selling.
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-12">
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

export default Universe;
