@echo off
echo ================================
echo Todo App - Frontend Setup
echo ================================
echo.

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Make sure Node.js and npm are installed
    pause
    exit /b 1
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Run: start.bat
echo.
pause
