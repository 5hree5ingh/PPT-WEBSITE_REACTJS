import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const SimpleGoogleAuth = ({ onSuccess, onError }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google OAuth success:', tokenResponse);
      onSuccess && onSuccess(tokenResponse);
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      onError && onError(error);
    },
  });

  return (
    <button 
      type="button" 
      className="social-auth-btn google-btn" 
      title="Sign in with Google"
      onClick={() => login()}
    >
      <ion-icon name="logo-google"></ion-icon>
    </button>
  );
};

export default SimpleGoogleAuth;
