 # Load FinancialPlanner.jsx content
$content = Get-Content -Path "src\FinancialPlanner.jsx"

# JavaScript function for file upload (uses single quotes inside to avoid JSX issues)
$uploadFunction = @"
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (evt) => {
    const text = evt.target.result;
    const rows = text.split('\\n').map(row => row.split(','));
    console.log('Parsed CSV Data:', rows);
    // You can transform and use this data to populate UI or save
  };
  reader.readAsText(file);
};
"@

# Inject JS function after "const [age, setAge]" line
$step1 = foreach ($line in $content) {
    if ($line -match 'const \[age, setAge\]') {
        @($line, '', $uploadFunction)
    } else {
        $line
    }
}

# React-safe file input component (avoid JSX confusion)
$uploadInput = @"
<div style={{ marginTop: 20 }}>
  <input type='file' accept='.csv' onChange={{handleFileUpload}} />
</div>
"@

# Inject file input block after welcome <h1> (avoid emoji match)
$finalContent = foreach ($line in $step1) {
    if ($line -match '<h1>.*Welcome, .*<\/h1>') {
        @($line, $uploadInput)
    } else {
        $line
    }
}

# Save updated content
$finalContent | Set-Content -Path "src\FinancialPlanner.jsx" -Encoding UTF8

Write-Host "`n✅ CSV upload handler and input injected successfully into FinancialPlanner.jsx"

