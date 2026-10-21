@echo off
rem Double-click BEFORE you start working on this computer.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0msk-sync.ps1" -Pull
echo.
pause
