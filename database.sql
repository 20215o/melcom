-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS melcom;
USE melcom;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName VARCHAR(100) NOT NULL,
    ContactPerson VARCHAR(100),
    Phone VARCHAR(20),
    Email VARCHAR(100),
    Address TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(100),
    Address TEXT,
    LoyaltyPoints INT DEFAULT 0,
    TotalSpent DECIMAL(10,2) DEFAULT 0.00,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
    BranchID INT AUTO_INCREMENT PRIMARY KEY,
    Location VARCHAR(100) NOT NULL,
    Address TEXT,
    Phone VARCHAR(20),
    ManagerID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    BranchID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchID) REFERENCES branches(BranchID)
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Position VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(100),
    BranchID INT,
    DepartmentID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchID) REFERENCES branches(BranchID),
    FOREIGN KEY (DepartmentID) REFERENCES departments(DepartmentID)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Description TEXT,
    CategoryID INT,
    SupplierID INT,
    Price DECIMAL(10,2) NOT NULL,
    QuantityInStock INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID),
    FOREIGN KEY (SupplierID) REFERENCES suppliers(SupplierID)
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    InventoryID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    Quantity INT NOT NULL,
    BranchID INT,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES products(ProductID),
    FOREIGN KEY (BranchID) REFERENCES branches(BranchID)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    EmployeeID INT,
    OrderDate DATE NOT NULL,
    DeliveryDate DATE,
    Status VARCHAR(20) DEFAULT 'Pending',
    TotalAmount DECIMAL(10,2) DEFAULT 0.00,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES customers(CustomerID),
    FOREIGN KEY (EmployeeID) REFERENCES employees(EmployeeID)
);

-- OrderItems table
CREATE TABLE IF NOT EXISTS order_items (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES products(ProductID)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    CustomerID INT,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentType VARCHAR(20) NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES orders(OrderID),
    FOREIGN KEY (CustomerID) REFERENCES customers(CustomerID)
);

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
    PayrollID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT,
    Salary DECIMAL(10,2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status VARCHAR(20) DEFAULT 'Active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (EmployeeID) REFERENCES employees(EmployeeID)
); 