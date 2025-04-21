import PayoffOptimizer from './PayoffOptimizer';
import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login';
import FinancialPlanner from './FinancialPlanner';
import './money.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const renderMoney = () => {
    return [...Array(10)].map((_, i) => (
      <div className='money' style={{ '--i': i }} key={i}>
        
      </div>
    ));
  };

  if (!user) return <Login onLogin={() => {}} />;

  return (
    <div>
      {renderMoney()}
      <div style={{
        padding: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <h1> Welcome, {user.email}</h1>
          <button onClick={() => signOut(auth)}>Logout</button>
          <p>This is your financial planning dashboard.</p>
          <FinancialPlanner />`n          <PayoffOptimizer />`n          <PayoffOptimizer />
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3> Today</h3>
          <p>{today}</p>
        </div>
      </div>
    </div>
  );
}

export default App;

