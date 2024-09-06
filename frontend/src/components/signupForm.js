import React, { useState } from 'react';
import axios from 'axios';

function SignupForm({handleLogin}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/user/register', {
        username,
        password,
      });
      console.log('Signup successful', response.data);
      handleLoginPage()
      // Handle successful login (e.g., save token, redirect)

    } catch (err) {
        console.log("err",err)
    }
  };

  const handleLoginPage = () => {
    handleLogin(true)
  }

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <label className="show-password-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="show-password-checkbox"
              />
              Show Password
            </label>
          </div>
        </div>
        <button type="submit" className="login-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupForm;
