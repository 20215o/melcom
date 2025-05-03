USE defaultdb;

-- Clear existing data in reverse order of dependencies
DELETE FROM transaction;
DELETE FROM `order`;
DELETE FROM payroll;
DELETE FROM inventory;
DELETE FROM department;
DELETE FROM employee;
DELETE FROM product;
DELETE FROM branch;
DELETE FROM customer;
DELETE FROM supplier;
DELETE FROM productcategory;

-- Insert sample data for ProductCategory
INSERT INTO productcategory (CategoryID, CategoryName) VALUES
(1, 'Electronics'),
(2, 'Clothing'),
(3, 'Groceries'),
(4, 'Furniture'),
(5, 'Toys');

-- Insert sample data for Supplier
INSERT INTO supplier (SupplierID, SupplierName, ContactDetails) VALUES
(1, 'TechTrend Innovations', 'tech@trend.com'),
(2, 'FashionHub', 'contact@fashionhub.com'),
(3, 'GroceryMart', 'info@grocerymart.com'),
(4, 'FurnitureWorld', 'sales@furnitureworld.com'),
(5, 'ToyGalaxy', 'support@toygalaxy.com');

-- Insert sample data for Customer
INSERT INTO customer (CustomerID, Name, LoyaltyPoints, Address, PhoneNumber, Email) VALUES
(1, 'John Doe', 100, '123 Main St, Accra', '0241234567', 'john@example.com'),
(2, 'Jane Smith', 50, '456 High St, Kumasi', '0242345678', 'jane@example.com'),
(3, 'Bob Johnson', 200, '789 Market St, Tema', '0243456789', 'bob@example.com'),
(4, 'Alice Brown', 75, '321 Beach Rd, Takoradi', '0244567890', 'alice@example.com'),
(5, 'Charlie Wilson', 150, '654 Hill Ave, Cape Coast', '0245678901', 'charlie@example.com');

-- Insert sample data for Branch
INSERT INTO branch (BranchID, Location) VALUES
(1, 'Accra'),
(2, 'Kumasi'),
(3, 'Tema'),
(4, 'Takoradi'),
(5, 'Cape Coast');

-- Insert sample data for Product
INSERT INTO product (ProductID, ProductName, CategoryID, Price, QuantityInStock, SupplierID) VALUES
(1, 'Laptop', 1, 1500.00, 10, 1),
(2, 'T-Shirt', 2, 20.00, 50, 2),
(3, 'Rice Bag', 3, 15.00, 100, 3),
(4, 'Chair', 4, 50.00, 20, 4),
(5, 'Teddy Bear', 5, 10.00, 30, 5);

-- Insert sample data for Employee
INSERT INTO employee (EmployeeID, Name, Position, PhoneNumber, BranchID) VALUES
(1, 'Esi Amoah', 'Manager', '0301234567', 1),
(2, 'Kojo Danso', 'Manager', '0302345678', 2),
(3, 'Akua Yeboah', 'Manager', '0303456789', 3),
(4, 'Kwesi Appiah', 'Manager', '0304567890', 4),
(5, 'Abena Mensah', 'Manager', '0305678901', 5);

-- Update Branch with ManagerID
UPDATE branch SET ManagerID = 1 WHERE BranchID = 1;
UPDATE branch SET ManagerID = 2 WHERE BranchID = 2;
UPDATE branch SET ManagerID = 3 WHERE BranchID = 3;
UPDATE branch SET ManagerID = 4 WHERE BranchID = 4;
UPDATE branch SET ManagerID = 5 WHERE BranchID = 5;

-- Insert sample data for Department
INSERT INTO department (DepartmentID, Name, Description, BranchID) VALUES
(1, 'Sales', 'Handles sales', 1),
(2, 'HR', 'Human Resources', 2),
(3, 'Inventory', 'Manages stock', 3),
(4, 'Finance', 'Handles payments', 4),
(5, 'Marketing', 'Promotes products', 5);

-- Insert sample data for Inventory
INSERT INTO inventory (InventoryID, ProductID, Quantity) VALUES
(1, 1, 10),
(2, 2, 50),
(3, 3, 100),
(4, 4, 20),
(5, 5, 30);

-- Insert sample data for Payroll
INSERT INTO payroll (PayrollID, EmployeeID, Salary, StartDate, EndDate) VALUES
(1, 1, 2000.00, '2024-01-01', '2024-12-31'),
(2, 2, 2000.00, '2024-01-01', '2024-12-31'),
(3, 3, 2000.00, '2024-01-01', '2024-12-31'),
(4, 4, 2000.00, '2024-01-01', '2024-12-31'),
(5, 5, 2000.00, '2024-01-01', '2024-12-31');

-- Insert sample data for Order
INSERT INTO `order` (OrderID, CustomerID, EmployeeID, OrderDate, TotalAmount, Status) VALUES
(1, 1, 1, '2024-10-01', 1500.00, 'Completed'),
(2, 2, 2, '2024-10-02', 40.00, 'Completed'),
(3, 3, 3, '2024-10-03', 75.00, 'Completed'),
(4, 4, 4, '2024-10-04', 100.00, 'Completed'),
(5, 5, 5, '2024-10-05', 30.00, 'Completed');

-- Insert sample data for Transaction
INSERT INTO transaction (TransactionID, OrderID, Amount, PaymentMethod, TransactionDate) VALUES
(1, 1, 1500.00, 'Card', '2024-10-01'),
(2, 2, 40.00, 'Cash', '2024-10-02'),
(3, 3, 75.00, 'Mobile Money', '2024-10-03'),
(4, 4, 100.00, 'Card', '2024-10-04'),
(5, 5, 30.00, 'Cash', '2024-10-05'); 