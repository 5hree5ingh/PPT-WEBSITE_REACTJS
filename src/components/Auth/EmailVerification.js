import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './EmailVerification.css';

const EmailVerification = ({ email, onVerificationComplete, onBack, isVerifying }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const { verifyOTP, resendOTP } = useAuth();

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    // Clear messages when user starts typing
    if (message || error) {
      setMessage('');
      setError('');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const result = await verifyOTP(email, otp);
    
    if (result.success) {
      setMessage('Email verified successfully! You can now login.');
      setTimeout(() => {
        onVerificationComplete();
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    const result = await resendOTP(email);
    
    if (result.success) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="email-verification">
      {showPopup && (
        <div className="otp-popup">
          <div className="popup-content">
            <ion-icon name="checkmark-circle" className="popup-icon"></ion-icon>
            <p>OTP sent successfully!</p>
          </div>
        </div>
      )}
      
      <div className="verification-header">
        <div className="verification-icon">
          <ion-icon name="mail-outline"></ion-icon>
        </div>
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit verification code to</p>
        <span className="email-display">{email}</span>
      </div>

      {message && <div className="verification-message success">{message}</div>}
      {error && <div className="verification-message error">{error}</div>}

      <form onSubmit={handleVerifyOTP} className="verification-form">
        <div className="otp-input-container">
          <input
            type="text"
            value={otp}
            onChange={handleOTPChange}
            placeholder="Enter 6-digit code"
            className="otp-input"
            maxLength="6"
            required
            disabled={isVerifying}
          />
        </div>

        <button 
          type="submit" 
          className="verify-btn" 
          disabled={loading || isVerifying || otp.length !== 6}
        >
          {isVerifying ? 'Verifying...' : loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="verification-footer">
        <p>Didn't receive the code?</p>
        <button 
          type="button" 
          className="resend-btn" 
          onClick={handleResendOTP}
          disabled={loading || isVerifying}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
