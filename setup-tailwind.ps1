# Uninstall old versions
npm uninstall tailwindcss postcss autoprefixer

# Reinstall compatible versions
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Recreate config files
npx tailwindcss init -p

# Overwrite postcss.config.js
@"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
"@ | Set-Content -Encoding UTF8 postcss.config.js

# Overwrite tailwind.config.js with correct content path
@"
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@ | Set-Content -Encoding UTF8 tailwind.config.js

# Confirm src/index.css content
@"
@tailwind base;
@tailwind components;
@tailwind utilities;

.animated-bg {
  background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1b1b1b);
  background-size: 400% 400%;
  animation: gradientFlow 10s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
"@ | Set-Content -Encoding UTF8 ./src/index.css

Write-Host "`n✅ Tailwind + PostCSS setup completed. Now run: npm run start" -ForegroundColor Green
