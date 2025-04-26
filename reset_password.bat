@echo off
echo MySQL Password Reset Tool
echo =======================

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as administrator...
) else (
    echo Please run this script as administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

REM Check if MySQL is installed in common locations
set MYSQL_PATH=
set MYSQL_DATA=
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin"
    set MYSQL_DATA="C:\ProgramData\MySQL\MySQL Server 8.0\Data"
    set MYSQL_SERVICE=MySQL80
) else if exist "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 5.7\bin"
    set MYSQL_DATA="C:\ProgramData\MySQL\MySQL Server 5.7\Data"
    set MYSQL_SERVICE=MySQL57
) else if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH="C:\xampp\mysql\bin"
    set MYSQL_DATA="C:\xampp\mysql\data"
    set MYSQL_SERVICE=mysql
)

if "%MYSQL_PATH%"=="" (
    echo MySQL not found in common locations.
    echo Please make sure MySQL is installed and add it to your PATH or
    echo modify this script with the correct path to mysql.exe
    pause
    exit /b 1
)

echo Found MySQL at: %MYSQL_PATH%
echo Using data directory: %MYSQL_DATA%
echo Using service name: %MYSQL_SERVICE%

REM Check if data directory exists
if not exist %MYSQL_DATA% (
    echo Data directory not found at: %MYSQL_DATA%
    echo Please check your MySQL installation and data directory location
    pause
    exit /b 1
)

REM Try to stop MySQL service
echo Stopping MySQL service...
net stop %MYSQL_SERVICE%
if errorlevel 1 (
    echo Failed to stop MySQL service. Trying alternative service names...
    
    REM Try alternative service names
    net stop MySQL80 >nul 2>&1
    net stop MySQL57 >nul 2>&1
    net stop mysql >nul 2>&1
    net stop MySQL >nul 2>&1
    
    echo Checking if MySQL is still running...
    tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo MySQL is still running. Trying to force stop...
        taskkill /F /IM mysqld.exe
    )
)

REM Start MySQL in safe mode with correct data directory
echo Starting MySQL in safe mode...
start /B %MYSQL_PATH%\mysqld.exe --skip-grant-tables --shared-memory --datadir=%MYSQL_DATA%
timeout /t 5

REM Create temporary SQL file for password reset
echo Creating password reset script...
echo FLUSH PRIVILEGES; > reset_temp.sql
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password'; >> reset_temp.sql
echo FLUSH PRIVILEGES; >> reset_temp.sql
echo EXIT; >> reset_temp.sql

REM Execute password reset
echo Resetting password...
%MYSQL_PATH%\mysql.exe -u root < reset_temp.sql

REM Clean up
del reset_temp.sql

REM Stop MySQL safe mode and start normally
echo Restarting MySQL service...
taskkill /F /IM mysqld.exe
timeout /t 2

REM Try to start MySQL service with different service names
echo Starting MySQL service...
net start %MYSQL_SERVICE% >nul 2>&1
if errorlevel 1 (
    net start MySQL80 >nul 2>&1
    if errorlevel 1 (
        net start MySQL57 >nul 2>&1
        if errorlevel 1 (
            net start mysql >nul 2>&1
            if errorlevel 1 (
                net start MySQL >nul 2>&1
            )
        )
    )
)

echo Password reset completed!
echo New password: new_password
echo Please change this password immediately after logging in.
pause 