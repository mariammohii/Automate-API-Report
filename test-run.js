const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(__dirname, 'reports');
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR);
}

// Get timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-');

function runHttpyac(filePath, name) {
  try {
    console.log(`\n▶ Running ${name}...`);
    const output = execSync(`httpyac ${filePath} --env yml --all`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    const logFile = path.join(REPORT_DIR, `${name}_${timestamp}.txt`);
    fs.writeFileSync(logFile, output, 'utf-8');
    console.log(`✅ ${name} succeeded. Output saved to ${logFile}`);
  } catch (err) {
    const errorLog = path.join(REPORT_DIR, `${name}_ERROR_${timestamp}.txt`);
    fs.writeFileSync(errorLog, err.stdout || err.stderr || err.message, 'utf-8');
    console.error(`❌ ${name} failed. Output saved to ${errorLog}`);
  }
}

// 1. Run login
runHttpyac('loginRequest/api.login.http', 'login');

// 2. Run update using global token
runHttpyac('Request/api.request.http', 'request');
