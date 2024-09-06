import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './signupForm';
import '../index.css';  // Import the CSS file

function MainComp() {
  const [showLogin, setShowLogin] = useState(true);
  const handleLogin = (val) => {
    console.log("val",val)
    setShowLogin(val)
  }

  return (
    <div >
        { showLogin ? 
            <LoginForm />
            : 
            <SignupForm handleLogin={handleLogin} />
        }
        <div className='switch-button'>
            <button className='' onClick={e=> setShowLogin(!showLogin)}>{showLogin ?  `Create User`: `Login`}</button>
        </div>
    </div>
  );
}

export default MainComp;
