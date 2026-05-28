@echo off
cd /d C:\Users\Visar\Desktop\ArbenLilaProjekt\backend
start "Backend" /B node server.js > backend.log 2>&1
timeout /t 3 /nobreak > nul
cd /d C:\Users\Visar\Desktop\ArbenLilaProjekt
npx localtunnel --port 5000 > tunnel-url.txt 2>&1
