import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ForgotPassword = ({ onClose }) => {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [loading, setLoading] = useState(false)
  const { backendUrl } = useContext(AppContext)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data } = await axios.post(backendUrl + '/api/company/forgot-password', { email })

      if (data.success) {
        toast.success(data.message)
        setCompanyId(data.companyId)
        setStep(2)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      return toast.error('Please enter 6-digit OTP')
    }

    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/company/verify-reset-otp', {
        companyId,
        otp
      })

      if (data.success) {
        toast.success(data.message)
        setStep(3)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/company/reset-password', {
        companyId,
        newPassword
      })

      if (data.success) {
        toast.success(data.message)
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <div className='relative bg-white p-10 rounded-xl text-slate-500 max-w-md w-full'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium mb-2'>
          {step === 1 && 'Forgot Password'}
          {step === 2 && 'Verify OTP'}
          {step === 3 && 'Reset Password'}
        </h1>
        <p className='text-sm text-center mb-6'>
          {step === 1 && 'Enter your email to receive OTP'}
          {step === 2 && 'Enter the 6-digit OTP sent to your email'}
          {step === 3 && 'Enter your new password'}
        </p>

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.email_icon} alt='' />
              <input 
                className='outline-none text-sm w-full' 
                onChange={e => setEmail(e.target.value)} 
                value={email} 
                type='email' 
                placeholder='Email' 
                required 
              />
            </div>
            <button 
              type='submit' 
              disabled={loading}
              className='bg-blue-600 w-full text-white py-2 rounded-full mt-4 disabled:bg-blue-300'
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <input 
                className='outline-none text-sm w-full text-center text-2xl tracking-widest' 
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                value={otp} 
                type='text' 
                placeholder='000000' 
                required 
                maxLength={6}
              />
            </div>
            <button 
              type='submit' 
              disabled={loading}
              className='bg-blue-600 w-full text-white py-2 rounded-full mt-4 disabled:bg-blue-300'
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.lock_icon} alt='' />
              <input 
                className='outline-none text-sm w-full' 
                onChange={e => setNewPassword(e.target.value)} 
                value={newPassword} 
                type='password' 
                placeholder='New Password' 
                required 
              />
            </div>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.lock_icon} alt='' />
              <input 
                className='outline-none text-sm w-full' 
                onChange={e => setConfirmPassword(e.target.value)} 
                value={confirmPassword} 
                type='password' 
                placeholder='Confirm Password' 
                required 
              />
            </div>
            <button 
              type='submit' 
              disabled={loading}
              className='bg-blue-600 w-full text-white py-2 rounded-full mt-4 disabled:bg-blue-300'
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <img 
          onClick={onClose} 
          className="absolute top-5 right-5 cursor-pointer" 
          src={assets.cross_icon}
          alt='Close'
        />
      </div>
    </div>
  )
}

export default ForgotPassword
