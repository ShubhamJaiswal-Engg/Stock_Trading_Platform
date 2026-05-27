import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { BACKEND_URL } from '../../config/urls.js';

const ForgetPassword = () => {
  const navigate = useNavigate();

  const backendUrl = BACKEND_URL;

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false); 
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const getErrorMessage = (error) => {
    const rawMessage = String(error?.message || "");
    if (/timeout/i.test(rawMessage)) return "Connection timeout";
    if (/network error/i.test(rawMessage)) return "Network error";
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed"
    );
  };

  const Spinner = () => (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-900 border-t-transparent"
      aria-hidden="true"
    />
  );
     const onSubmitEmail = async (e)=>{
       e.preventDefault()
       if (isSendingOtp) return;
       try {
        setIsSendingOtp(true);
        const {data} = await axios.post(
          backendUrl + '/forget-password',
          { email },
          { timeout: 120000 }
        );
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
       } catch (error) {
        toast.error(getErrorMessage(error));
       } finally {
        setIsSendingOtp(false);
       }
     };

     const onSubmitOtp = async (e) =>{
       e.preventDefault();
        try {
        if (isVerifyingOtp) return;
        setIsVerifyingOtp(true);
        const {data} = await axios.post(backendUrl + '/verify-otp',{email, otp});
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsOtpSubmited(true);
       } catch (error) {
        toast.error(getErrorMessage(error));
       } finally {
        setIsVerifyingOtp(false);
       }
     }

      const onSubmitNewPassword = async (e)=>{
       e.preventDefault();
       try {
        if (isResettingPassword) return;
        setIsResettingPassword(true);
        const {data} = await axios.post(backendUrl + '/reset-password', {email,otp,newPassword});
        data.success ? toast.success(data.message) : toast.error(data.message)
        setTimeout(() => {
          data.success && navigate('/login', { replace: true })
        }, 2000);
       } catch (error) {
        toast.error(getErrorMessage(error));
       } finally {
        setIsResettingPassword(false);
       }
     };

  return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 w-full max-w-5xl items-center">
        <div className="flex justify-center">
          <img src="media/images/page-otp.svg" alt="Login" className="w-4/5 md:w-full" />
        </div>
          <div className="flex justify-center">

           {/* If email not sent then this component show  */}

          {!isEmailSent &&
          <form onSubmit={onSubmitEmail} className="flex flex-col w-full max-w-md space-y-2 px-4 md:px-0">
            <h1 className="text-3xl font-medium text-gray-800">Reset Password</h1>
            <p className="text-gray-500 mb-3">Enter your registered email address</p>
            
            <div className="relative">
              <EmailIcon fontSize="small" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input  type="email"
              autoCorrect="on"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={e => setEmail(e.target.value)} 
                disabled={isSendingOtp}
                className="w-full pl-10 pr-2 py-2.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400 text-gray-800" />
            </div>
            <button
              type="submit"
              disabled={isSendingOtp}
              className={`w-full bg-blue-500 text-white font-semibold py-2.5 px-4 rounded text-lg transition duration-200 mt-2 ${
                isSendingOtp ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isSendingOtp ? <Spinner /> : null}
                {isSendingOtp ? "Sending OTP..." : "Submit"}
              </span>
            </button>
          </form>
            }
            {isEmailSent && !isOtpSubmited && 
             <form onSubmit={onSubmitOtp} className="flex flex-col w-full max-w-md space-y-2 px-4 md:px-0">
            <h1 className="text-3xl font-medium text-gray-800">Reset Password OTP</h1>
            <p className="text-gray-500 mb-3">Enter the 6-digit code sent to your email id.</p>
            
            <div className="flex flex-row-reverse w-full mb-8">
              <div className="relative peer w-full">
                <input
                  autoComplete="one-time-code" inputMode="numeric" maxLength="6" type="tel" placeholder="••••••" pattern="[0-9]+" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isVerifyingOtp}
                  className="focus-visible:outline-none focus:border-blue-400 py-1.5 md:py-4 flex w-full border border-gray-300 px-5 ring-offset-2 disabled:cursor-not-allowed disabled:border-0 disabled:bg-[#F7F7F7E5] rounded-none rounded-r text-[1.8rem] tracking-[0.6rem] placeholder:text-[#D9D9D9] text-gray-800 transition-colors"
                  required
                />
                <label className="absolute left-4 top-0 bg-white text-gray-800 font-semibold -translate-y-3 px-1 m-0 flex items-center"></label>
              </div>
              <div className="peer-focus-within:border-blue-400 flex shrink-0 items-center gap-2 rounded-l border border-r-0 border-gray-300 px-4 py-2 sm:py-3 bg-white transition-colors">
                <img src="data:image/svg+xml,%3csvg%20width='19'%20height='27'%20viewBox='0%200%2019%2027'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15.542%201.41406H3.45866C2.12397%201.41406%201.04199%202.49604%201.04199%203.83073V23.1641C1.04199%2024.4987%202.12397%2025.5807%203.45866%2025.5807H15.542C16.8767%2025.5807%2017.9587%2024.4987%2017.9587%2023.1641V3.83073C17.9587%202.49604%2016.8767%201.41406%2015.542%201.41406Z'%20stroke='black'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M9.5%2020.75H9.51239'%20stroke='black'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e" alt="India Phone number" aria-label="India Flag" className="w-4 md:flex" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isVerifyingOtp}
              className={`w-full bg-blue-500 text-white font-semibold py-2.5 px-4 rounded text-lg transition duration-200 mt-2 ${
                isVerifyingOtp ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isVerifyingOtp ? <Spinner /> : null}
                {isVerifyingOtp ? "Verifying OTP..." : "Submit otp"}
              </span>
            </button>
          </form>
            }
            {isEmailSent && isOtpSubmited && 
             <form onSubmit={onSubmitNewPassword} className="flex flex-col w-full max-w-md space-y-2 px-4 md:px-0">
            <h1 className="text-3xl font-medium text-gray-800">New Password</h1>
            <p className="text-gray-500 mb-3">Enter the new password below.</p>
            
            <div className="relative">
              <LockIcon fontSize="small" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input  type="password"
              autoCorrect="on"
                name="email"
                value={newPassword}
                placeholder="Enter your new password"
                onChange={e => setNewPassword(e.target.value)}
                disabled={isResettingPassword}
                className="w-full pl-10 pr-2 py-2.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-400 text-gray-800" />
            </div>
            <button
              type="submit"
              disabled={isResettingPassword}
              className={`w-full bg-blue-500 text-white font-semibold py-2.5 px-4 rounded text-lg transition duration-200 mt-2 ${
                isResettingPassword ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isResettingPassword ? <Spinner /> : null}
                {isResettingPassword ? "Resetting..." : "Submit"}
              </span>
            </button>
          </form>
            }
          <ToastContainer />
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword



//       {!isEmailSent &&
//        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

//       <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
//       <p className='text-center mb-6 text-indigo-300'>Enter your registered email address.</p>

//       <div className='mb-4 flex items-center text-indigo-300 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        
//         <EmailIcon className='mr-2 w-3 h-3' />
//         {/* <img src={assets.mail_icon} alt="" /> */}
//         <input onChange={e => setEmail(e.target.value)} value={email} required type="text" placeholder='Email id'  className='bg-transparent outline-none text-white'/>
//       </div>
//       <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
//     </form>
// }
//     {/* {//Otp input form } */}

//     {!isOtpSubmited && isEmailSent &&
//      <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
//       <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
//       <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
//       <div className='flex justify-between mb-8' onPaste={handlePaste}>
//         {Array(6).fill(0).map((_, index)=>(
//           <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333a5c] text-white text-center 
//           text-xl rounded-md ' ref={e => inputRefs.current[index] = e}  onInput={(e) => handleInput(e, index)} onKeyDown={(e)=>handleKeyDown(e, index)} />
//         ))}
//       </div>
//       <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
//       </form>
// }
//       {/* Enter new Password */}
//       {isOtpSubmited && isEmailSent &&
//       <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

//       <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
//       <p className='text-center mb-6 text-indigo-300'>Enter the new password below.</p>

//       <div className='mb-4 flex items-center text-indigo-300 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        
//         <LockIcon className='mr-2 w-3 h-3'  />
//         {/* <img src={assets.lock_icon} alt="" /> */}
//         <input onChange={e => setNewPassword(e.target.value)} value={newPassword} required type="password" placeholder='Password'  className='bg-transparent outline-none text-white'/>
//       </div>
//       <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
//     </form>
// }
//     </div>
