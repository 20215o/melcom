USE Melcom;

-- Clear existing data in reverse order of dependencies
DELETE FROM `Transaction`;
DELETE FROM `Order`;
DELETE FROM Payroll;
DELETE FROM Inventory;
DELETE FROM Department;
DELETE FROM Employee;
DELETE FROM Product;
DELETE FROM Branch;
DELETE FROM Customer;
DELETE FROM Supplier;
DELETE FROM ProductCategory;

-- Insert sample data for ProductCategory
INSERT INTO ProductCategory (CategoryID, CategoryName) VALUES
(1, 'Electronics'),
(2, 'Clothing'),
(3, 'Groceries'),
(4, 'Furniture'),
(5, 'Toys');

-- Insert sample data for Supplier
INSERT INTO Supplier (SupplierID, SupplierName, ContactDetails) VALUES
(1, 'TechTrend Innovations', 'tech@trend.com'),
(2, 'FashionHub', 'contact@fashionhub.com'),
(3, 'GroceryMart', 'info@grocerymart.com'),
(4, 'FurnitureWorld', 'sales@furnitureworld.com'),
(5, 'ToyGalaxy', 'support@toygalaxy.com');

-- Insert sample data for Customer
INSERT INTO Customer (CustomerID, Name, LoyaltyPoints, Address, PhoneNumber, Email) VALUES
(1, 'John Doe', 100, '123 Main St, Accra', '0241234567', 'john@example.com'),
(2, 'Jane Smith', 50, '456 High St, Kumasi', '0242345678', 'jane@example.com'),
(3, 'Bob Johnson', 200, '789 Market St, Tema', '0243456789', 'bob@example.com'),
(4, 'Alice Brown', 75, '321 Beach Rd, Takoradi', '0244567890', 'alice@example.com'),
(5, 'Charlie Wilson', 150, '654 Hill Ave, Cape Coast', '0245678901', 'charlie@example.com');

-- Insert sample data for Branch
INSERT INTO Branch (BranchID, Location) VALUES
(1, 'Accra'),
(2, 'Kumasi'),
(3, 'Tema'),
(4, 'Takoradi'),
(5, 'Cape Coast');

-- Insert sample data for Product
INSERT INTO Product (ProductID, ProductName, CategoryID, Price, QuantityInStock, SupplierID) VALUES
(1, 'Laptop', 1, 1500.00, 10, 1),
(2, 'T-Shirt', 2, 20.00, 50, 2),
(3, 'Rice Bag', 3, 15.00, 100, 3),
(4, 'Chair', 4, 50.00, 20, 4),
(5, 'Teddy Bear', 5, 10.00, 30, 5);

-- Insert sample data for Employee
INSERT INTO Employee (EmployeeID, Name, Position, PhoneNumber, BranchID) VALUES
(1, 'Esi Amoah', 'Manager', '0301234567', 1),
(2, 'Kojo Danso', 'Manager', '0302345678', 2),
(3, 'Akua Yeboah', 'Manager', '0303456789', 3),
(4, 'Kwesi Appiah', 'Manager', '0304567890', 4),
(5, 'Abena Mensah', 'Manager', '0305678901', 5);

-- Update Branch with ManagerID
UPDATE Branch SET ManagerID = 1 WHERE BranchID = 1;
UPDATE Branch SET ManagerID = 2 WHERE BranchID = 2;
UPDATE Branch SET ManagerID = 3 WHERE BranchID = 3;
UPDATE Branch SET ManagerID = 4 WHERE BranchID = 4;
UPDATE Branch SET ManagerID = 5 WHERE BranchID = 5;

-- Insert sample data for Department
INSERT INTO Department (DepartmentID, Name, Description, BranchID) VALUES
(1, 'Sales', 'Handles sales', 1),
(2, 'HR', 'Human Resources', 2),
(3, 'Inventory', 'Manages stock', 3),
(4, 'Finance', 'Handles payments', 4),
(5, 'Marketing', 'Promotes products', 5);

-- Insert sample data for Inventory
INSERT INTO Inventory (InventoryID, ProductID, Quantity) VALUES
(1, 1, 10),
(2, 2, 50),
(3, 3, 100),
(4, 4, 20),
(5, 5, 30);

-- Insert sample data for Payroll
INSERT INTO Payroll (PayrollID, EmployeeID, Salary, StartDate, EndDate) VALUES
(1, 1, 2000.00, '2024-01-01', '2024-12-31'),
(2, 2, 2000.00, '2024-01-01', '2024-12-31'),
(3, 3, 2000.00, '2024-01-01', '2024-12-31'),
(4, 4, 2000.00, '2024-01-01', '2024-12-31'),
(5, 5, 2000.00, '2024-01-01', '2024-12-31');

-- Insert sample data for Order
INSERT INTO `Order` (OrderID, CustomerID, EmployeeID, OrderDate, DeliveryDate, Status, ProductID, Quantity) VALUES
(1, 1, 1, '2024-10-01', '2024-10-05', 'Delivered', 1, 1),
(2, 2, 2, '2024-10-02', '2024-10-06', 'Delivered', 2, 2),
(3, 3, 3, '2024-10-03', '2024-10-07', 'Delivered', 3, 5),
(4, 4, 4, '2024-10-04', '2024-10-08', 'Delivered', 4, 2),
(5, 5, 5, '2024-10-05', '2024-10-09', 'Delivered', 5, 3);

-- Insert sample data for Transaction
INSERT INTO `Transaction` (TransactionID, OrderID, CustomerID, PaymentType, TotalAmount, `Date`) VALUES
(1, 1, 1, 'Credit', 1500.00, '2024-10-01'),
(2, 2, 2, 'Cash', 40.00, '2024-10-02'),
(3, 3, 3, 'Debit', 75.00, '2024-10-03'),
(4, 4, 4, 'Online', 100.00, '2024-10-04'),
(5, 5, 5, 'Credit', 30.00, '2024-10-05'); 