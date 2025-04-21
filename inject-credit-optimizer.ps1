
# Backup the current FinancialPlanner.jsx
Copy-Item -Path "src\FinancialPlanner.jsx" -Destination "src\FinancialPlanner.jsx.bak.20250421114819" -Force

# Read existing content
$content = Get-Content -Path "src\FinancialPlanner.jsx"

# Inject logic for credit report upload and optimizer
$creditLogic = @'
const [debts, setDebts] = useState([]);

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
'@

$step1 = foreach ($line in $content) {
    if ($line -match 'const \[target, setTarget\]') {
        @(
            $line
            "const [history, setHistory] = useState([]);"
            ""
            $creditLogic
        )
    } else {
        $line
    }
}

# Add upload and display block after existing export button
$creditInput = @'
<div style={{ marginTop: 20 }}>
  <input type="file" accept=".csv" onChange={handleCreditReportUpload} />
</div>
<div>
  <h2>Recommended Payoff Plan</h2>
  {getPayoffPlan().map((debt, idx) => (
    <div key={idx}>
      <strong>{debt.name}</strong>: Pay ${debt.recommendedPayment}
    </div>
  ))}
</div>
'@

$finalContent = foreach ($line in $step1) {
    if ($line -match '<button onClick=\{exportToExcel\}>Export to Excel & Save</button>') {
        @(
            $line
            $creditInput
        )
    } else {
        $line
    }
}

# Write modified content back
$finalContent | Set-Content -Path "src\FinancialPlanner.jsx" -Encoding UTF8

Write-Host "`n✅ Credit report upload and payoff optimizer injected. Backup saved."
