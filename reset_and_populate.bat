@echo off
echo Resetting and populating Melcom database...

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

REM Drop and recreate the database
echo Dropping and recreating database...
%MYSQL_PATH% -u root -p -e "DROP DATABASE IF EXISTS Melcom; CREATE DATABASE Melcom;"

REM Execute schema.sql
echo Creating tables...
%MYSQL_PATH% -u root -p Melcom < schema.sql

REM Execute seed.sql
echo Populating data...
%MYSQL_PATH% -u root -p Melcom < seed.sql

echo Database reset and populated successfully!
pause 