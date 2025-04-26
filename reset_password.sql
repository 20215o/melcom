-- Stop the MySQL service first
-- Run this in an elevated command prompt (Run as Administrator)

-- Step 1: Stop MySQL service
-- net stop mysql

-- Step 2: Start MySQL in safe mode with skip-grant-tables
-- mysqld --skip-grant-tables --shared-memory

-- Step 3: Connect to MySQL (in a new command prompt)
-- mysql -u root

-- Step 4: Run these commands in MySQL
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;

-- Step 5: Stop the MySQL service and start it normally
-- net stop mysql
-- net start mysql 