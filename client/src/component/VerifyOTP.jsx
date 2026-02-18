import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerifyOTP = ({ companyId, onClose, onVerified }) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const { backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)
  const navigate = useNavigate()

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      return toast.error('Please enter 6-digit OTP')
    }

    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/company/verify-otp', {
        companyId,
        otp
      })

      if (data.success) {
        toast.success(data.message)
        setCompanyData(data.company)
        setCompanyToken(data.token)
        localStorage.setItem('companyToken', data.token)
        onClose()
        navigate('/dashboard')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handleResend = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/company/resend-otp', {
        companyId
      })

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form onSubmit={handleVerify} className='relative bg-white p-10 rounded-xl text-slate-500 max-w-md w-full'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium mb-2'>Verify Your Email</h1>
        <p className='text-sm text-center mb-6'>Enter the 6-digit OTP sent to your email</p>

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

        <div className='mt-4 text-center'>
          <p className='text-sm'>Didn't receive OTP?</p>
          <button 
            type='button'
            onClick={handleResend} 
            className='text-blue-600 text-sm mt-1 hover:underline'
          >
            Resend OTP
          </button>
        </div>

        <img 
          onClick={onClose} 
          className="absolute top-5 right-5 cursor-pointer" 
          src={assets.cross_icon}
          alt='Close'
        />
      </form>
    </div>
  )
}

export default VerifyOTP
