# Step 1: Ensure you're in the app directory
Set-Location -Path "$PSScriptRoot"

# Step 2: Install required packages
Write-Host "`n📦 Installing TailwindCSS, PostCSS, Autoprefixer, and React Calendar..." -ForegroundColor Cyan
npm install -D tailwindcss postcss autoprefixer
npm install react-calendar pdf-parse file-saver xlsx

# Step 3: Initialize Tailwind
npx tailwindcss init -p

# Step 4: Update tailwind.config.js
$tconfig = @"
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        gradientFlow: "gradientFlow 15s ease infinite",
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': { backgroundPosition: "0% 50%" },
          '50%': { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
}
"@
$tconfig | Set-Content -Path "./tailwind.config.js" -Encoding UTF8

# Step 5: Update src/index.css with Tailwind base styles and animation
$indexCSS = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-900 text-white;
}

.animated-bg {
  background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1b1b2f);
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
}
"@
$indexCSS | Set-Content -Path "./src/index.css" -Encoding UTF8

# Step 6: Confirm success
Write-Host "`n✅ UI styling and dependencies installed. Run 'npm start' to see changes." -ForegroundColor Green
