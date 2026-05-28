$logFile = "C:\Users\Visar\Desktop\ArbenLilaProjekt\tunnel-log.txt"

# Start backend
Set-Location "C:\Users\Visar\Desktop\ArbenLilaProjekt\backend"
$p1 = Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js" -PassThru -RedirectStandardOutput "$logFile-backend.txt" -RedirectStandardError "$logFile-backend-err.txt"

Start-Sleep -Seconds 3

# Start localtunnel
$p2cmd = "npx localtunnel --port 5000 2>&1"
$p2 = Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c $p2cmd" -PassThru -RedirectStandardOutput "$logFile-tunnel.txt" -RedirectStandardError "$logFile-tunnel-err.txt"

Start-Sleep -Seconds 5

Write-Host "Backend PID: $($p1.Id)"
Write-Host "Tunnel PID: $($p2.Id)"

# Show tunnel URL from log
if (Test-Path "$logFile-tunnel.txt") {
  $tunnelLog = Get-Content "$logFile-tunnel.txt" -Raw
  Write-Host "Tunnel URL: $($tunnelLog)"
}

# Keep script running
while ($true) {
  if ($p1.HasExited) { Write-Host "Backend exited!" }
  if ($p2.HasExited) { Write-Host "Tunnel exited!" }
  Start-Sleep -Seconds 10
}
