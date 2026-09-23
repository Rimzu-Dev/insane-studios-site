@echo off
cls
echo ===================================================
echo     Insane Studios Site - Ultimate Automator       
echo ===================================================


:: 1. Check for changes after VS Code closes
echo.
echo [1/2] Checking for modified files...
git status -s

:: Ask the user for a commit message
echo.
set /p msg="Enter a brief description of your updates: "

:: If user enters nothing, set a default message
if "%msg%"=="" set msg="Routine website update"

:: 2. Run Git commands to push changes
echo.
echo [2/2] Uploading changes to GitHub...
git add .
git commit -m "%msg%"
git push origin main

echo.
echo ===================================================
echo     Task Complete! Your website is updated.
echo ===================================================
pause
