import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // callback to unlock the app
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 10 }}>
      <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
        />
        <button type='submit' style={{ width: '100%', padding: 10 }}>
          {isLoginMode ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: 10, cursor: 'pointer', color: 'blue' }} onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? 'Need an account? Register' : 'Already have an account? Login'}
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
