# Push credit-risk-analyzer to GitHub
# Run this in PowerShell from this folder, or right-click -> Run with PowerShell
# Repo: https://github.com/MampotjeMabusela/credit-risk-analyzer

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Initializing git..." -ForegroundColor Cyan
git init
git add .
Write-Host "Files to commit:" -ForegroundColor Cyan
git status --short
Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Credit Risk Analyzer"
git branch -M main
Write-Host "Adding remote..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/MampotjeMabusela/credit-risk-analyzer.git
Write-Host "Pushing to GitHub (you may be asked for username/password)..." -ForegroundColor Cyan
git push -u origin main
Write-Host "Done. Open: https://github.com/MampotjeMabusela/credit-risk-analyzer" -ForegroundColor Green
