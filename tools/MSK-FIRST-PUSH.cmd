@echo off
rem One-time: move hamzi-lms into the vault, commit, push every repo. Double-click to run.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0msk-first-push.ps1"
echo.
pause
