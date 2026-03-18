# MedNorm AI — One-Command Startup Script
# Team LegacyCoderz | HackMatrix 2.0
#
# Usage: .\start.ps1
# Starts both the FastAPI backend and Next.js frontend in separate windows.

$Host.UI.RawUI.WindowTitle = "MedNorm AI — Startup"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  MedNorm AI — Clinical Data Normalization Engine" -ForegroundColor Cyan
Write-Host "  Team LegacyCoderz | HackMatrix 2.0 x Jilo Health" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# ─── Check Python ────────────────────────────────────────────────────────────
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python not found. Please install Python 3.11+." -ForegroundColor Red
    exit 1
}
$pyVer = python --version 2>&1
Write-Host "[OK] Found $pyVer" -ForegroundColor Green

# ─── Check Node ──────────────────────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js not found. Please install Node.js 18+." -ForegroundColor Red
    exit 1
}
$nodeVer = node --version 2>&1
Write-Host "[OK] Found Node.js $nodeVer" -ForegroundColor Green

# ─── Create .env if it doesn't exist ─────────────────────────────────────────
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "[INFO] No .env file found — copying from .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "[INFO] .env created. App will run in Demo Mode (no OpenAI key needed)." -ForegroundColor Yellow
}

# ─── Setup Python virtual environment ────────────────────────────────────────
Write-Host ""
Write-Host "[1/4] Setting up Python virtual environment..." -ForegroundColor Cyan
if (-not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "      Created venv/" -ForegroundColor Gray
} else {
    Write-Host "      venv/ already exists — skipping creation" -ForegroundColor Gray
}

# ─── Install Python dependencies ─────────────────────────────────────────────
Write-Host "[2/4] Installing Python dependencies..." -ForegroundColor Cyan
& "venv\Scripts\pip.exe" install -r backend/requirements.txt --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] pip install failed." -ForegroundColor Red
    exit 1
}
Write-Host "      Dependencies installed." -ForegroundColor Gray

# ─── Install Node dependencies ────────────────────────────────────────────────
Write-Host "[3/4] Installing Node.js dependencies..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    npm install --silent
    Write-Host "      node_modules/ created." -ForegroundColor Gray
} else {
    Write-Host "      node_modules/ already exists — skipping install" -ForegroundColor Gray
}

# ─── Launch backend ───────────────────────────────────────────────────────────
Write-Host "[4/4] Launching servers..." -ForegroundColor Cyan
Write-Host ""

$backendCmd = "& 'venv\Scripts\python.exe' -m uvicorn backend.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; $Host.UI.RawUI.WindowTitle = 'MedNorm AI — Backend (FastAPI)'; $backendCmd"

Start-Sleep -Seconds 2

# ─── Launch frontend ──────────────────────────────────────────────────────────
$frontendCmd = "npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; `$Host.UI.RawUI.WindowTitle = 'MedNorm AI — Frontend (Next.js)'; $frontendCmd"

# ─── Done ─────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  MedNorm AI is starting up!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:   http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:    http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host "  ReDoc:      http://localhost:8000/redoc" -ForegroundColor White
Write-Host ""
Write-Host "  Two new terminal windows have been opened." -ForegroundColor Gray
Write-Host "  Wait ~5 seconds for both servers to be ready." -ForegroundColor Gray
Write-Host ""
Write-Host "  Press any key to open the app in your browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:3000"
