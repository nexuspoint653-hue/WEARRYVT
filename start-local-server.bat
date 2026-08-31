@echo off
title RYVT - local server
cd /d "%~dp0"
set PORT=5173

echo Starting the RYVT site on http://localhost:%PORT%
echo Close this window to stop the server.
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  py -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  python -m http.server %PORT%
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  npx --yes serve -l %PORT% .
  goto :eof
)

echo No Python or Node found on this machine.
echo You can still open index.html directly - everything is self-contained.
pause
