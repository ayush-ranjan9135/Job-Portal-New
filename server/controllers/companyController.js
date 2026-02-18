import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import { sendOTPEmail } from "../utils/emailService.js";
import { generateOTP, hashOTP, verifyOTP as verifyOTPUtil, isOTPExpired, getOTPExpiry } from "../utils/otpUtils.js";

// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExist = await Company.findOne({ email });

    if (companyExist) {
      return res.json({ success: false, message: "Company Already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
      isVerified: false,
      otp: hashedOTP,
      otpExpiry: getOTPExpiry(),
      lastOtpSent: new Date()
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'verification');
    
    if (!emailResult.success) {
      console.error('Email send failed:', emailResult.error);
      return res.json({ success: false, message: 'Failed to send OTP email' });
    }

    res.json({
      success: true,
      message: "Registration successful. Please verify your email with OTP sent to " + email,
      companyId: company._id
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all companies (for debugging)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}, 'name email');
    console.log('All companies in database:', companies);
    res.json({ success: true, companies });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Check if account is verified
    if (!company.isVerified) {
      return res.json({ success: false, message: "Please verify your email first", needsVerification: true, companyId: company._id });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (isMatch) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category, applicationLink } = req.body;
  const companyId = req.company._id;

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
      applicationLink,
      visible: true,
    });

    await newJob.save();

    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    const applicants = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();

    return res.json({ success: true, applicants });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company posted jobs
export const getCompanyPostedJob = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change job applicants status
export const changeJobApplicantsStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    await JobApplication.findOneAndUpdate({ _id: id }, { status });
    res.json({ success: true, message: "Status Changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change job visibility
export const changeVisiblity = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }

    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
      await job.save();
      return res.json({ success: true, job });
    } else {
      return res.json({ success: false, message: "Unauthorized action" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { companyId, otp } = req.body;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    if (company.isVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // Check OTP attempts
    if (company.otpAttempts >= 5) {
      return res.json({ success: false, message: "Too many attempts. Please request a new OTP" });
    }

    // Check if OTP expired
    if (isOTPExpired(company.otpExpiry)) {
      return res.json({ success: false, message: "OTP expired. Please request a new one" });
    }

    // Verify OTP
    const isValid = verifyOTPUtil(otp, company.otp);

    if (!isValid) {
      company.otpAttempts += 1;
      await company.save();
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Mark as verified
    company.isVerified = true;
    company.otp = undefined;
    company.otpExpiry = undefined;
    company.otpAttempts = 0;
    await company.save();

    res.json({
      success: true,
      message: "Email verified successfully",
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  const { companyId } = req.body;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    if (company.isVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // Rate limiting: Allow resend only after 1 minute
    if (company.lastOtpSent && (Date.now() - company.lastOtpSent.getTime()) < 60000) {
      return res.json({ success: false, message: "Please wait 1 minute before requesting new OTP" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    company.otp = hashedOTP;
    company.otpExpiry = getOTPExpiry();
    company.otpAttempts = 0;
    company.lastOtpSent = new Date();
    await company.save();

    // Send OTP email
    await sendOTPEmail(company.email, otp, 'verification');

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({ success: false, message: "Email not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    company.otp = hashedOTP;
    company.otpExpiry = getOTPExpiry();
    company.otpAttempts = 0;
    company.lastOtpSent = new Date();
    await company.save();

    // Send OTP email
    await sendOTPEmail(email, otp, 'reset');

    res.json({ success: true, message: "OTP sent to your email", companyId: company._id });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify OTP for Password Reset
export const verifyResetOTP = async (req, res) => {
  const { companyId, otp } = req.body;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Check OTP attempts
    if (company.otpAttempts >= 5) {
      return res.json({ success: false, message: "Too many attempts. Please request a new OTP" });
    }

    // Check if OTP expired
    if (isOTPExpired(company.otpExpiry)) {
      return res.json({ success: false, message: "OTP expired. Please request a new one" });
    }

    // Verify OTP
    const isValid = verifyOTPUtil(otp, company.otp);

    if (!isValid) {
      company.otpAttempts += 1;
      await company.save();
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // OTP verified, allow password reset
    res.json({ success: true, message: "OTP verified", companyId: company._id });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { companyId, newPassword } = req.body;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    company.password = hashPassword;
    company.otp = undefined;
    company.otpExpiry = undefined;
    company.otpAttempts = 0;
    await company.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};