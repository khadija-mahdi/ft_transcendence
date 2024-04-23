'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const LoginComponent = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setVisible(!visible); // Toggle password visibility
  };

  const handleLogin = () => {
    // Perform login logic here
    console.log('Logging in with Email Address:', emailAddress, 'and password:', password);
  };

  const handleIntraLogin = () => {
    // Implement Intra login logic here
    console.log('Continue With Intra');
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Continue With Google');
  };

  return (
	<div id="mainContainer">
	<h2>
	<Image
		id="mainLogo"
		src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
		alt="Intra Image"
		width={40}
		height={40}
		/>
		<span id="mainWord">Transcendent</span>
	  </h2>
    <div className="login-container">
      <h2>Join Transcendent</h2>

      {/* Intra login button */}
      <button id="DirectLogin" onClick={handleIntraLogin}>
        <Image
          id="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
          alt="Intra Image"
          width={25}
          height={25}
        />
        Continue with Intra
      </button>

      {/* Google login button */}
      <button id="DirectLogin" onClick={handleGoogleLogin}>
        <Image
          id="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          alt="Google Image"
          width={25}
          height={25}
        />
        Continue with Google
      </button>

      <div className="line-container">
        <hr className="line" />
        <div className="left-text"> OR </div>
        <hr className="line" />
      </div>

      <label htmlFor="emailAddress">Email Address:</label>
      <input
        type="text"
        id="emailAddress"
        value={emailAddress}
        placeholder="john@gmail.com"
        onChange={(e) => setEmailAddress(e.target.value)}
      />

      <label htmlFor="password">Password:</label>
      <div className="password-input-container">
        <input
          type={visible ? "text" : "password"}
          id="password"
          value={password}
          placeholder="**************"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="password-toggle" onClick={togglePasswordVisibility}>
          {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </div>
      </div>

      <button onClick={handleLogin}><strong></strong>Sign in</button>
      <p>By continuing, you agree to Transcendent's <a href="https://yourtermservice.com" className="terms-link">Terms of Service</a> and <a href="https://yourtermservice.com" className="terms-link">Privacy Policy</a></p>
    </div>
	</div>
  );
};

export default LoginComponent;
