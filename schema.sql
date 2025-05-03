-- Drop the database if it exists
DROP DATABASE IF EXISTS Melcom;

-- Create the database
USE defaultdb;

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS supplier;
DROP TABLE IF EXISTS productcategory;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    IsAdmin BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT CHK_UserEmail CHECK (Email LIKE '%@%.%')
);

-- ProductCategory (no FK dependencies)
CREATE TABLE productcategory (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(50) NOT NULL,
    CONSTRAINT CHK_PC_CategoryName CHECK (CategoryName <> '')
);

-- Supplier (no FK dependencies)
CREATE TABLE supplier ( 
    SupplierID INT PRIMARY KEY AUTO_INCREMENT,
    SupplierName VARCHAR(100) NOT NULL,
    ContactDetails VARCHAR(255),
    CONSTRAINT CHK_S_SupplierName CHECK (SupplierName <> '')
);

-- Customer (no FK dependencies)
CREATE TABLE customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    LoyaltyPoints INT DEFAULT 0,
    Address VARCHAR(255) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15),
    Email VARCHAR(100),
    CONSTRAINT CHK_C_Name CHECK (Name <> ''),
    CONSTRAINT CHK_C_Address CHECK (Address <> ''),
    CONSTRAINT CHK_C_Email CHECK (Email LIKE '%@%.%'),
    CONSTRAINT CHK_C_LoyaltyPoints CHECK (LoyaltyPoints >= 0)
);

-- Branch (no FK dependencies initially)
CREATE TABLE branch (
    BranchID INT PRIMARY KEY AUTO_INCREMENT,
    ManagerID INT,
    Location VARCHAR(255) NOT NULL,
    CONSTRAINT CHK_B_Location CHECK (Location <> '')
);

-- Product (depends on ProductCategory and Supplier)
CREATE TABLE product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(100) NOT NULL,
    CategoryID INT,
    Price DECIMAL(10, 2) NOT NULL,
    QuantityInStock INT NOT NULL,
    SupplierID INT,
    CONSTRAINT FK_P_ProductCategory FOREIGN KEY (CategoryID) REFERENCES productcategory(CategoryID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_P_ProductSupplier FOREIGN KEY (SupplierID) REFERENCES supplier(SupplierID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT CHK_P_ProductName CHECK (ProductName <> ''),
    CONSTRAINT CHK_P_Price CHECK (Price > 0),
    CONSTRAINT CHK_P_QuantityInStock CHECK (QuantityInStock >= 0)
);

-- Employee (depends on Branch)
CREATE TABLE employee (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(15),
    BranchID INT,
    CONSTRAINT FK_E_EmployeeBranch FOREIGN KEY (BranchID) REFERENCES branch(BranchID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT CHK_E_EmployeeName CHECK (Name <> ''),
    CONSTRAINT CHK_E_Position CHECK (Position <> '')
);

-- Add the foreign key for ManagerID in Branch now that Employee exists
ALTER TABLE branch
ADD CONSTRAINT FK_B_BranchManager FOREIGN KEY (ManagerID) REFERENCES employee(EmployeeID) ON DELETE SET NULL ON UPDATE CASCADE;

-- Department (depends on Branch)
CREATE TABLE department (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Description TEXT,
    BranchID INT,
    CONSTRAINT FK_D_DepartmentBranch FOREIGN KEY (BranchID) REFERENCES branch(BranchID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_D_DepartmentName CHECK (Name <> '')
);

-- Inventory (depends on Product)
CREATE TABLE inventory (
    InventoryID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT,
    Quantity INT NOT NULL,
    CONSTRAINT FK_I_InventoryProduct FOREIGN KEY (ProductID) REFERENCES product(ProductID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_I_InventoryQuantity CHECK (Quantity >= 0)
);

-- Payroll (depends on Employee)
CREATE TABLE payroll (
    PayrollID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    Salary DECIMAL(10, 2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    CONSTRAINT FK_PY_PayrollEmployee FOREIGN KEY (EmployeeID) REFERENCES employee(EmployeeID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_PY_Salary CHECK (Salary > 0),
    CONSTRAINT CHK_PY_Dates CHECK (EndDate IS NULL OR EndDate > StartDate)
);

-- Order (depends on Customer, Employee, and Product)
CREATE TABLE `order` (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT,
    EmployeeID INT,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(20) DEFAULT 'Pending',
    CONSTRAINT FK_O_OrderCustomer FOREIGN KEY (CustomerID) REFERENCES customer(CustomerID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_O_OrderEmployee FOREIGN KEY (EmployeeID) REFERENCES employee(EmployeeID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT CHK_O_TotalAmount CHECK (TotalAmount >= 0),
    CONSTRAINT CHK_O_Status CHECK (Status IN ('Pending', 'Completed', 'Cancelled'))
);

-- Transaction (depends on Order)
CREATE TABLE transaction (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentMethod VARCHAR(20) NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_T_TransactionOrder FOREIGN KEY (OrderID) REFERENCES `order`(OrderID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_T_Amount CHECK (Amount >= 0),
    CONSTRAINT CHK_T_PaymentMethod CHECK (PaymentMethod IN ('Cash', 'Card', 'Mobile Money'))
);