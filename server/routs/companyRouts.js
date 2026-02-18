import express from 'express'
import {
  changeJobApplicantsStatus,
  changeVisiblity,
  forgotPassword,
  getAllCompanies,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJob,
  loginCompany,
  postJob,
  registerCompany,
  resendOTP,
  resetPassword,
  verifyOTP,
  verifyResetOTP
} from '../controllers/companyController.js'

import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// Verify OTP
router.post('/verify-otp', verifyOTP)

// Resend OTP
router.post('/resend-otp', resendOTP)

// Company login
router.post('/login', loginCompany)

// Forgot Password
router.post('/forgot-password', forgotPassword)

// Verify Reset OTP
router.post('/verify-reset-otp', verifyResetOTP)

// Reset Password
router.post('/reset-password', resetPassword)

// Debug: Get all companies
router.get('/debug-companies', getAllCompanies)

// Get company data
router.get('/company', protectCompany, getCompanyData)

// Post a job
router.post('/post-job', protectCompany, postJob) 

// Get applicants data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

// Get company job list
router.get('/list-jobs', protectCompany, getCompanyPostedJob)

// Change applicants status
router.post('/change-status', protectCompany, changeJobApplicantsStatus)

// Change job visibility
router.post('/change-visiblity', protectCompany, changeVisiblity)

export default router
