import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This pulls in the styles including @tailwind and .animated-bg
import FinancialPlanner from './FinancialPlanner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FinancialPlanner />
  </React.StrictMode>
);

 

