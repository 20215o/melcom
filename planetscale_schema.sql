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
    CategoryID INT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL
);

-- Supplier (no FK dependencies)
CREATE TABLE Supplier (
    SupplierID INT PRIMARY KEY,
    SupplierName VARCHAR(100) NOT NULL,
    ContactDetails VARCHAR(255)
);

-- Customer (no FK dependencies)
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY,
    LoyaltyPoints INT DEFAULT 0,
    Address VARCHAR(255) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15),
    Email VARCHAR(100)
);

-- Branch (ManagerID references Employee, but we can create it first and add the FK later)
CREATE TABLE Branch (
    BranchID INT PRIMARY KEY,
    ManagerID INT, -- FK to Employee, added later
    Location VARCHAR(255) NOT NULL
);

-- Now create tables with foreign key dependencies

-- Product (depends on ProductCategory and Supplier)
CREATE TABLE Product (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    CategoryID INT,
    Price DECIMAL(10, 2) NOT NULL,
    QuantityInStock INT NOT NULL,
    SupplierID INT,
    FOREIGN KEY (CategoryID) REFERENCES ProductCategory(CategoryID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Employee (depends on Branch)
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(15),
    BranchID INT,
    FOREIGN KEY (BranchID) REFERENCES Branch(BranchID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Add the foreign key for ManagerID in Branch now that Employee exists
ALTER TABLE Branch
ADD FOREIGN KEY (ManagerID) REFERENCES Employee(EmployeeID) ON DELETE SET NULL ON UPDATE CASCADE;

-- Department (depends on Branch)
CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Description TEXT,
    BranchID INT,
    FOREIGN KEY (BranchID) REFERENCES Branch(BranchID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inventory (depends on Product)
CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY,
    ProductID INT,
    Quantity INT NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Payroll (depends on Employee)
CREATE TABLE Payroll (
    PayrollID INT PRIMARY KEY,
    EmployeeID INT,
    Salary DECIMAL(10, 2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Order (depends on Customer, Employee, and Product)
CREATE TABLE `Order` (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    EmployeeID INT,
    OrderDate DATE NOT NULL,
    DeliveryDate DATE,
    Status VARCHAR(20) NOT NULL,
    ProductID INT,
    Quantity INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Transaction (depends on Order and Customer)
CREATE TABLE `Transaction` (
    TransactionID INT PRIMARY KEY,
    OrderID INT,
    CustomerID INT,
    PaymentType VARCHAR(50) NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    `Date` DATE NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE SET NULL ON UPDATE CASCADE
); 