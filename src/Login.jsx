import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-container text-center p-8">
      <h1 className="text-3xl font-bold">Sign In</h1>
      <input type="email" placeholder="Email" className="block mt-4 p-2" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="block mt-2 p-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Login</button>
    </div>
  );
}

export default Login;
