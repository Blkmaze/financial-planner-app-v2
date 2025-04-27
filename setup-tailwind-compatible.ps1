Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

# Step 1: Install Tailwind with PostCSS 7 compatibility
npm install -D @tailwindcss/postcss7-compat tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9

# Step 2: Create postcss.config.js
@"
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
}
"@ | Set-Content -Path "postcss.config.js" -Encoding UTF8

# Step 3: Create tailwind.config.js
npx tailwindcss init

(Get-Content "./tailwind.config.js") -replace "(?<=content:\s*)\[\]", '["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"]' | Set-Content "./tailwind.config.js"

# Step 4: Add tailwind + animation styles to src/index.css
$css = @"
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
"@
$css | Set-Content -Path "src/index.css" -Encoding UTF8

# Step 5: Launch app
npm start
