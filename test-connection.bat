@echo off
echo ========================================
echo MERN Stack Connection Test
echo ========================================
echo.

echo Testing Backend Server...
echo.
curl -s http://localhost:5000/ | findstr "success"
if %errorlevel% equ 0 (
    echo [OK] Backend root endpoint is working
) else (
    echo [ERROR] Backend root endpoint failed
)
echo.

echo Testing Backend Health...
echo.
curl -s http://localhost:5000/health | findstr "success"
if %errorlevel% equ 0 (
    echo [OK] Backend health endpoint is working
) else (
    echo [ERROR] Backend health endpoint failed
)
echo.

echo Testing Courses API...
echo.
curl -s http://localhost:5000/api/courses | findstr "success"
if %errorlevel% equ 0 (
    echo [OK] Courses API is working
) else (
    echo [ERROR] Courses API failed
)
echo.

echo Testing Frontend...
echo.
curl -s http://localhost:5173/ | findstr "<!doctype html"
if %errorlevel% equ 0 (
    echo [OK] Frontend is serving HTML
) else (
    echo [ERROR] Frontend is not responding
)
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Open browser to http://localhost:5173
echo 2. Check API Status widget in bottom-right
echo 3. Try navigating to different pages
echo.
pause
