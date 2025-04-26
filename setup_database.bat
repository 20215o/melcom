@echo off
echo Setting up Melcom database...

REM Check if MySQL is installed in common locations
set MYSQL_PATH=
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
) else if exist "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe"
) else if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
)

if "%MYSQL_PATH%"=="" (
    echo MySQL not found in common locations.
    echo Please make sure MySQL is installed and add it to your PATH or
    echo modify this script with the correct path to mysql.exe
    pause
    exit /b 1
)

echo Found MySQL at: %MYSQL_PATH%

REM Execute schema.sql
%MYSQL_PATH% -u root -p < schema.sql
if errorlevel 1 (
    echo Error executing schema.sql
    pause
    exit /b 1
)

REM Execute seed.sql
%MYSQL_PATH% -u root -p < seed.sql
if errorlevel 1 (
    echo Error executing seed.sql
    pause
    exit /b 1
)

echo Database setup completed successfully!
pause 