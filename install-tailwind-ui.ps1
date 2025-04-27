# PowerShell script to set up Tailwind CSS + animated gradient UI
Write-Host "🚀 Installing Tailwind CSS..." -ForegroundColor Cyan
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Update tailwind.config.js with content paths and custom theme
$tconfig = @"
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient': "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1b1b2f)"
      },
      animation: {
        'gradient-x': 'gradientX 15s ease infinite'
      },
      keyframes: {
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    }
  },
  plugins: [],
}
"@
$tconfig | Set-Content -Path "./tailwind.config.js" -Encoding UTF8

# Write styles.css with Tailwind layers + custom class
$styles = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

.animated-bg {
  background-image: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1b1b2f);
  background-size: 400% 400%;
  animation: gradientX 15s ease infinite;
}

@keyframes gradientX {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
"@
$styles | Set-Content -Path "./src/styles.css" -Encoding UTF8

Write-Host "`n✅ Tailwind and styling ready. Restarting app..." -ForegroundColor Green
Start-Process "cmd.exe" "/k npm start"
