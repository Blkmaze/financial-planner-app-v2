# Navigate to the project directory
Set-Location -Path "$PSScriptRoot"

Write-Host "📦 Installing dependencies..."
npm install -D tailwindcss postcss autoprefixer
npm install react-calendar file-saver xlsx firebase

Write-Host "⚙️ Initializing Tailwind CSS..."
npx tailwindcss init -p

# Configure tailwind.config.js
$tconfig = @"
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
"@
$tconfig | Set-Content -Path "./tailwind.config.js" -Encoding UTF8

# Overwrite index.css with Tailwind and animations
$indexCSS = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 🎨 Animated gradient background */
.animated-bg {
  background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1b1b2f);
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
"@
$indexCSS | Set-Content -Path "./src/index.css" -Encoding UTF8

Write-Host "`n✅ UI Styling Installed. Now restart with 'npm start'"
