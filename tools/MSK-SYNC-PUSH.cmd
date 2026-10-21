@echo off
rem Double-click AFTER you finish working on this computer.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0msk-sync.ps1" -Push
echo.
pause
