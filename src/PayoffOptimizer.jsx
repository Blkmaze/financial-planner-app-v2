import React, { useState } from 'react';

export default function PayoffOptimizer() {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [balance, setBalance] = useState('');
  const [apr, setApr] = useState('');
  const [budget, setBudget] = useState('');

  const addCard = () => {
    if (!cardName || !balance || !apr) return;
    setCards([...cards, {
      id: Date.now(),
      name: cardName,
      balance: parseFloat(balance),
      apr: parseFloat(apr)
    }]);
    setCardName('');
    setBalance('');
    setApr('');
  };

  const getSuggestion = () => {
    if (!budget || cards.length === 0) return null;
    const sorted = [...cards].sort((a, b) => b.apr - a.apr);
    return sorted[0];
  };

  const calculateInterestSavings = () => {
    const sorted = [...cards].sort((a, b) => b.apr - a.apr);
    let totalInterest = 0;
    let monthlyBudget = parseFloat(budget);

    for (let i = 0; i < sorted.length; i++) {
      const card = sorted[i];
      const monthlyRate = card.apr / 100 / 12;
      let balance = card.balance;
      let months = 0;

      while (balance > 0 && monthlyBudget > 0) {
        const interest = balance * monthlyRate;
        const payment = Math.min(monthlyBudget, balance + interest);
        balance = balance + interest - payment;
        totalInterest += interest;
        months++;
        if (months > 240) break;
      }
    }

    return totalInterest;
  };

  const nextCard = getSuggestion();
  const projectedSavings = calculateInterestSavings();

  return (
    <div style={{ marginTop: 50 }}>
      <h2> Payoff Optimizer</h2>
      <p>Use your extra budget wisely  we'll suggest which card to attack next.</p>

      <div style={{ marginBottom: 10 }}>
        <input type='text' placeholder='Card Name' value={cardName} onChange={(e) => setCardName(e.target.value)} />
        <input type='number' placeholder='Balance ($)' value={balance} onChange={(e) => setBalance(e.target.value)} />
        <input type='number' placeholder='APR (%)' value={apr} onChange={(e) => setApr(e.target.value)} />
        <button onClick={addCard}>Add Card</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <input type='number' placeholder='Monthly Budget for Payoff ($)' value={budget} onChange={(e) => setBudget(e.target.value)} />
      </div>

      {nextCard && (
        <div style={{ marginTop: 20 }}>
          <h3> Suggested Next Payoff:</h3>
          <p><strong>{nextCard.name}</strong>   at {nextCard.apr}% APR</p>
          <p> Projected Interest Saved (All Cards): <strong></strong></p>
        </div>
      )}

      <ul style={{ marginTop: 20 }}>
        {cards.map(card => (
          <li key={card.id}>
            {card.name}   @ {card.apr}%
          </li>
        ))}
      </ul>
    </div>
  );
}
