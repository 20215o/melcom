-- Drop the database if it exists
DROP DATABASE IF EXISTS Melcom;

-- Create the database
CREATE DATABASE Melcom;
USE Melcom;

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS `Transaction`;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS Payroll;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Branch;
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Supplier;
DROP TABLE IF EXISTS ProductCategory;

-- Create tables without foreign key dependencies first

-- ProductCategory (no FK dependencies)
CREATE TABLE ProductCategory (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(50) NOT NULL,
    CONSTRAINT CHK_CategoryName CHECK (CategoryName <> '')
);

-- Supplier (no FK dependencies)
CREATE TABLE Supplier ( 
    SupplierID INT PRIMARY KEY AUTO_INCREMENT,
    SupplierName VARCHAR(100) NOT NULL,
    ContactDetails VARCHAR(255),
    CONSTRAINT CHK_SupplierName CHECK (SupplierName <> '')
);

-- Customer (no FK dependencies)
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    LoyaltyPoints INT DEFAULT 0,
    Address VARCHAR(255) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15),
    Email VARCHAR(100),
    CONSTRAINT CHK_Name CHECK (Name <> ''),
    CONSTRAINT CHK_Address CHECK (Address <> ''),
    CONSTRAINT CHK_Email CHECK (Email LIKE '%@%.%'),
    CONSTRAINT CHK_LoyaltyPoints CHECK (LoyaltyPoints >= 0)
);

-- Branch (ManagerID references Employee, but we can create it first and add the FK later)
CREATE TABLE Branch (
    BranchID INT PRIMARY KEY AUTO_INCREMENT,
    ManagerID INT, -- FK to Employee, added later
    Location VARCHAR(255) NOT NULL,
    CONSTRAINT CHK_Location CHECK (Location <> '')
);

-- Now create tables with foreign key dependencies

-- Product (depends on ProductCategory and Supplier)
CREATE TABLE Product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(100) NOT NULL,
    CategoryID INT,
    Price DECIMAL(10, 2) NOT NULL,
    QuantityInStock INT NOT NULL,
    SupplierID INT,
    CONSTRAINT FK_Product_Category FOREIGN KEY (CategoryID) REFERENCES ProductCategory(CategoryID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_Product_Supplier FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT CHK_ProductName CHECK (ProductName <> ''),
    CONSTRAINT CHK_Price CHECK (Price > 0),
    CONSTRAINT CHK_QuantityInStock CHECK (QuantityInStock >= 0)
);

-- Employee (depends on Branch)
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(15),
    BranchID INT,
    CONSTRAINT FK_Employee_Branch FOREIGN KEY (BranchID) REFERENCES Branch(BranchID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT CHK_EmployeeName CHECK (Name <> ''),
    CONSTRAINT CHK_Position CHECK (Position <> '')
);

-- Add the foreign key for ManagerID in Branch now that Employee exists
ALTER TABLE Branch
ADD CONSTRAINT FK_Branch_Manager FOREIGN KEY (ManagerID) REFERENCES Employee(EmployeeID) ON DELETE SET NULL ON UPDATE CASCADE;

-- Department (depends on Branch)
CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Description TEXT,
    BranchID INT,
    CONSTRAINT FK_Department_Branch FOREIGN KEY (BranchID) REFERENCES Branch(BranchID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_DepartmentName CHECK (Name <> '')
);

-- Inventory (depends on Product)
CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT,
    Quantity INT NOT NULL,
    CONSTRAINT FK_Inventory_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_InventoryQuantity CHECK (Quantity >= 0)
);

-- Payroll (depends on Employee)
CREATE TABLE Payroll (
    PayrollID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    Salary DECIMAL(10, 2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    CONSTRAINT FK_Payroll_Employee FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_Salary CHECK (Salary > 0),
    CONSTRAINT CHK_Dates CHECK (EndDate IS NULL OR EndDate > StartDate)
);

-- Order (depends on Customer, Employee, and Product)
CREATE TABLE `Order` (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT,
    EmployeeID INT,
    OrderDate DATE NOT NULL,
    DeliveryDate DATE,
    Status VARCHAR(20) NOT NULL,
    ProductID INT,
    Quantity INT NOT NULL,
    CONSTRAINT FK_Order_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_Order_Employee FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_Order_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT CHK_OrderStatus CHECK (Status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
    CONSTRAINT CHK_OrderQuantity CHECK (Quantity > 0),
    CONSTRAINT CHK_OrderDates CHECK (DeliveryDate IS NULL OR DeliveryDate >= OrderDate)
);

-- Transaction (depends on Order and Customer)
CREATE TABLE `Transaction` (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT,
    CustomerID INT,
    PaymentType VARCHAR(50) NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    `Date` DATE NOT NULL,
    CONSTRAINT FK_Transaction_Order FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_Transaction_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT CHK_PaymentType CHECK (PaymentType IN ('Cash', 'Credit', 'Debit', 'Online')),
    CONSTRAINT CHK_TotalAmount CHECK (TotalAmount >= 0)
); 