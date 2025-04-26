USE Melcom;

-- Query 1: Total revenue per customer (Inner Join, Aggregate, Sorting)
SELECT c.Name, SUM(t.TotalAmount) AS TotalSpent
FROM Customer c
INNER JOIN `Transaction` t ON c.CustomerID = t.CustomerID
GROUP BY c.Name
ORDER BY TotalSpent DESC;

-- Query 2: Products with low stock (Outer Join, Condition with IN, Mathematical Condition)
SELECT p.ProductName, p.QuantityInStock, i.Quantity AS InventoryQuantity
FROM Product p
LEFT OUTER JOIN Inventory i ON p.ProductID = i.ProductID
WHERE p.QuantityInStock < 30
AND p.CategoryID IN (1, 4, 5);

-- Query 3: Employees with their branch and department (Inner Join, NOT NULL, Sorting)
SELECT e.Name, e.Position, b.Location, d.Name AS DepartmentName
FROM Employee e
INNER JOIN Branch b ON e.BranchID = b.BranchID
INNER JOIN Department d ON b.BranchID = d.BranchID
WHERE e.PhoneNumber IS NOT NULL
ORDER BY e.Name;

-- Query 4: Orders with product details (Inner Join, LIKE, Condition with IN)
SELECT o.OrderID, c.Name AS CustomerName, p.ProductName
FROM `Order` o
INNER JOIN Customer c ON o.CustomerID = c.CustomerID
INNER JOIN Product p ON o.ProductID = p.ProductID
WHERE o.Status IN ('Delivered', 'Shipped')
AND p.ProductName LIKE '%phone%';

-- Query 5: Total quantity ordered per product category (Inner Join, Aggregate, Sorting)
SELECT pc.CategoryName, SUM(o.Quantity) AS TotalOrdered
FROM ProductCategory pc
INNER JOIN Product p ON pc.CategoryID = p.CategoryID
INNER JOIN `Order` o ON p.ProductID = o.ProductID
GROUP BY pc.CategoryName
ORDER BY TotalOrdered DESC;

-- Query 6: Employees with no payroll records (Outer Join, NOT NULL, LIKE)
SELECT e.Name, e.Position
FROM Employee e
LEFT OUTER JOIN Payroll pr ON e.EmployeeID = pr.EmployeeID
WHERE pr.PayrollID IS NULL
AND e.Position LIKE 'Sales%';

-- Query 7: Using a CTE to find high-spending customers (CTE, Inner Join, Aggregate, Mathematical Condition)
WITH HighSpenders AS (
    SELECT t.CustomerID, SUM(t.TotalAmount) AS TotalSpent
    FROM `Transaction` t
    GROUP BY t.CustomerID
    HAVING SUM(t.TotalAmount) > 100
)
SELECT c.Name, hs.TotalSpent
FROM HighSpenders hs
INNER JOIN Customer c ON hs.CustomerID = c.CustomerID
ORDER BY hs.TotalSpent DESC; 