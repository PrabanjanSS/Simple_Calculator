# Calculator Web App

## Folder Structure
```
calculator/
├── frontend/
│   ├── index.html     ← main page
│   ├── style.css      ← all styles
│   └── script.js      ← talks to backend
└── backend/
    ├── server.js      ← express server (all routes)
    └── package.json   ← dependencies
```

## How to Run

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 — Install dependencies
```
cd backend
npm install
```

### Step 3 — Start the server
```
node server.js
```

### Step 4 — Open the website
Open your browser and go to: http://localhost:3000

## Features
- Add, subtract, multiply, divide
- Calculation history (saved on server)
- Clear history button
- Error handling (divide by zero, empty fields)

## Default
No login needed. Just open and use.
