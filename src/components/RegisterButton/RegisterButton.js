import React from 'react';

const RegisterButton = ({ 
  onClick, 
  disabled = false, 
  loading = false, 
  isRegistered = false,
  className = '',
  children = 'REGISTER FOR TOURNAMENT'
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log('RegisterButton clicked');
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      id="register-tournament-btn"
      type="button"
      className={`register-tournament-btn ${isRegistered ? 'registered' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <ion-icon name="hourglass-outline"></ion-icon>
          Processing...
        </>
      ) : isRegistered ? (
        'UNREGISTER FROM TOURNAMENT'
      ) : (
        children
      )}
    </button>
  );
};

export default RegisterButton;
