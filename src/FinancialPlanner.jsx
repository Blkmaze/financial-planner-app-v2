 import React, { useEffect, useState } from 'react';
import Login from './Login';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function FinancialPlanner() {
  const [user, setUser] = useState(null);
  const [income, setIncome] = useState(5000);
  const [car, setCar] = useState(400);
  const [housing, setHousing] = useState(1000);
  const [tsp, setTsp] = useState(500);
  const [savings, setSavings] = useState(100000);
  const [age, setAge] = useState(58);
  const [target, setTarget] = useState(68);
  const [debts, setDebts] = useState([]);

  const discretionary = income - (car + housing + tsp);

  const handleCreditReportUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.split('\n');
      const parsed = lines
        .map(line => line.split(','))
        .filter(row => row.length >= 4)
        .map(([name, balance, rate, minPayment]) => ({
          name,
          balance: parseFloat(balance),
          rate: parseFloat(rate),
          minPayment: parseFloat(minPayment)
        }));
      setDebts(parsed);
      console.log("Parsed Credit Report:", parsed);
    };
    reader.readAsText(file);
  };

  const getPayoffPlan = () => {
    if (debts.length === 0) return [];
    const sortedDebts = [...debts].sort((a, b) => b.rate - a.rate);
    let monthlyAvailable = discretionary;
    return sortedDebts.map(debt => {
      let payment = Math.max(debt.minPayment, Math.min(debt.balance, monthlyAvailable));
      monthlyAvailable -= payment;
      return { ...debt, recommendedPayment: payment.toFixed(2) };
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        setUser(authUser);
        loadDataFromFirestore(authUser.uid);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadDataFromFirestore = async (uid) => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setIncome(data.income || 0);
        setCar(data.car || 0);
        setHousing(data.housing || 0);
        setTsp(data.tsp || 0);
        setSavings(data.savings || 0);
        setAge(data.age || 0);
        setTarget(data.target || 0);
      }
    } catch (err) {
      alert("Load failed: " + err.message);
    }
  };

  const saveDataToFirestore = async () => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        income, car, housing, tsp, savings, age, target
      });
      alert("Saved to cloud!");
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const calculateRetirement = () => {
    let futureValue = savings;
    const monthlyRate = 0.10 / 12;
    const months = (target - age) * 12;
    for (let i = 0; i < months; i++) {
      futureValue = futureValue * (1 + monthlyRate) + tsp;
    }
    return futureValue.toFixed(2);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const rows = text.split('\n').map(row => row.split(','));
      console.log('Parsed CSV Data:', rows);
    };
    reader.readAsText(file);
  };

  const exportToExcel = () => {
    const data = [{
      Income: income,
      Car: car,
      Housing: housing,
      TSP: tsp,
      Savings: savings,
      Age: age,
      TargetRetirementAge: target,
      ProjectedRetirementSavings: calculateRetirement(),
      Discretionary: discretionary,
      EmergencyFund: (car + housing) * 6
    }];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FinancialSummary");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Will_Wealth_Commander.xlsx");
    saveDataToFirestore();
  };

  if (!user) return <Login />;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Welcome, {user.email}</h1>
      <p>This is your financial planning dashboard.</p>

      <button onClick={exportToExcel}>Export to Excel & Save</button>

      <hr style={{ margin: '30px 0' }} />

      <h3>Upload Bank Statement</h3>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <hr style={{ margin: '30px 0' }} />

      <h3>Upload Credit Report</h3>
      <input type="file" accept=".csv" onChange={handleCreditReportUpload} />

      <hr style={{ margin: '30px 0' }} />

      <h2>Payoff Optimizer</h2>
      <p>Use your extra budget wisely. We'll suggest which card to attack next.</p>
      {getPayoffPlan().map((debt, idx) => (
        <div key={idx} style={{ marginBottom: '10px' }}>
          <strong>{debt.name}</strong>: Pay <strong>${debt.recommendedPayment}</strong>
        </div>
      ))}
    </div>
  );
}

export default FinancialPlanner;



