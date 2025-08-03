@echo off
echo Starting Live Polling System...
echo.

echo Starting Backend Server...
start cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start cmd /k "npm run start:windows"

echo.
echo Both servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000/api/
echo.
echo Press any key to close this window...
pause > nul
