const express = require('express');
const router = express.Router();
const { query } = require('../utils/dbUtils');
const orderRoutes = require('./orderRoutes');

// Categories routes
router.get('/category', async(req, res) => {
    try {
        const categories = await query('SELECT * FROM ProductCategory');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

router.post('/category', async(req, res) => {
    try {
        const { CategoryName } = req.body;
        const result = await query(
            'INSERT INTO ProductCategory (CategoryName) VALUES (?)', [CategoryName]
        );
        res.json({ CategoryID: result.insertId, CategoryName });
    } catch (error) {
        res.status(500).json({ error: 'Error adding category' });
    }
});

router.put('/category/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { CategoryName } = req.body;
        await query(
            'UPDATE ProductCategory SET CategoryName = ? WHERE CategoryID = ?', [CategoryName, id]
        );
        res.json({ CategoryID: id, CategoryName });
    } catch (error) {
        res.status(500).json({ error: 'Error updating category' });
    }
});

router.delete('/category/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM ProductCategory WHERE CategoryID = ?', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
});

// Employees routes
router.get('/employee', async(req, res) => {
    try {
        console.log('Fetching employees...');
        const employees = await query(`
            SELECT e.*, b.Location as BranchName 
            FROM Employee e 
            LEFT JOIN Branch b ON e.BranchID = b.BranchID
        `);
        console.log('Employees fetched:', employees);
        res.json(employees);
    } catch (error) {
        console.error('Error in /employee route:', error);
        res.status(500).json({
            error: 'Error fetching employees',
            details: error.message
        });
    }
});

router.post('/employee', async(req, res) => {
    try {
        console.log('Adding employee with data:', req.body);
        const { Name, Position, PhoneNumber, BranchID } = req.body;

        if (!Name || !Position || !BranchID) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['Name', 'Position', 'BranchID']
            });
        }

        const result = await query(
            'INSERT INTO Employee (Name, Position, PhoneNumber, BranchID) VALUES (?, ?, ?, ?)', [Name, Position, PhoneNumber || null, BranchID]
        );

        console.log('Employee added successfully:', result);
        res.json({
            EmployeeID: result.insertId,
            Name,
            Position,
            PhoneNumber,
            BranchID
        });
    } catch (error) {
        console.error('Error in POST /employee route:', error);
        res.status(500).json({
            error: 'Error adding employee',
            details: error.message
        });
    }
});

router.put('/employee/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { Name, Position, PhoneNumber, BranchID } = req.body;
        await query(
            'UPDATE Employee SET Name = ?, Position = ?, PhoneNumber = ?, BranchID = ? WHERE EmployeeID = ?', [Name, Position, PhoneNumber, BranchID, id]
        );
        res.json({ EmployeeID: id, Name, Position, PhoneNumber, BranchID });
    } catch (error) {
        res.status(500).json({ error: 'Error updating employee' });
    }
});

router.delete('/employee/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM Employee WHERE EmployeeID = ?', [id]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
});

// Products routes
router.get('/product', async(req, res) => {
    try {
        const products = await query(`
            SELECT p.*, c.CategoryName, s.SupplierName 
            FROM Product p 
            LEFT JOIN ProductCategory c ON p.CategoryID = c.CategoryID 
            LEFT JOIN Supplier s ON p.SupplierID = s.SupplierID
        `);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Transactions routes
router.get('/transaction', async(req, res) => {
    try {
        console.log('Fetching transactions...');
        const transactions = await query(`
            SELECT t.*, 
                   c.Name as CustomerName,
                   o.OrderID,
                   p.ProductName
            FROM \`Transaction\` t
            LEFT JOIN Customer c ON t.CustomerID = c.CustomerID
            LEFT JOIN \`Order\` o ON t.OrderID = o.OrderID
            LEFT JOIN Product p ON o.ProductID = p.ProductID
        `);
        console.log('Transactions fetched:', transactions);
        res.json(transactions);
    } catch (error) {
        console.error('Error in /transaction route:', error);
        res.status(500).json({
            error: 'Error fetching transactions',
            details: error.message
        });
    }
});

router.post('/transaction', async(req, res) => {
    try {
        console.log('Adding transaction with data:', req.body);
        const { OrderID, CustomerID, PaymentType, TotalAmount, Date } = req.body;

        if (!OrderID || !CustomerID || !PaymentType || !TotalAmount || !Date) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['OrderID', 'CustomerID', 'PaymentType', 'TotalAmount', 'Date']
            });
        }

        const result = await query(
            'INSERT INTO \`Transaction\` (OrderID, CustomerID, PaymentType, TotalAmount, Date) VALUES (?, ?, ?, ?, ?)', [OrderID, CustomerID, PaymentType, TotalAmount, Date]
        );

        console.log('Transaction added successfully:', result);
        res.json({
            TransactionID: result.insertId,
            OrderID,
            CustomerID,
            PaymentType,
            TotalAmount,
            Date
        });
    } catch (error) {
        console.error('Error in POST /transaction route:', error);
        res.status(500).json({
            error: 'Error adding transaction',
            details: error.message
        });
    }
});

router.put('/transaction/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { OrderID, CustomerID, PaymentType, TotalAmount, Date } = req.body;

        if (!OrderID || !CustomerID || !PaymentType || !TotalAmount || !Date) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['OrderID', 'CustomerID', 'PaymentType', 'TotalAmount', 'Date']
            });
        }

        const result = await query(
            'UPDATE \`Transaction\` SET OrderID = ?, CustomerID = ?, PaymentType = ?, TotalAmount = ?, Date = ? WHERE TransactionID = ?', [OrderID, CustomerID, PaymentType, TotalAmount, Date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({
            TransactionID: id,
            OrderID,
            CustomerID,
            PaymentType,
            TotalAmount,
            Date
        });
    } catch (error) {
        console.error('Error in PUT /transaction route:', error);
        res.status(500).json({
            error: 'Error updating transaction',
            details: error.message
        });
    }
});

router.delete('/transaction/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM \`Transaction\` WHERE TransactionID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /transaction route:', error);
        res.status(500).json({
            error: 'Error deleting transaction',
            details: error.message
        });
    }
});

// Suppliers routes
router.get('/supplier', async(req, res) => {
    try {
        console.log('Fetching suppliers...');
        const suppliers = await query('SELECT * FROM Supplier');
        console.log('Suppliers fetched:', suppliers);
        res.json(suppliers);
    } catch (error) {
        console.error('Error in /supplier route:', error);
        res.status(500).json({
            error: 'Error fetching suppliers',
            details: error.message
        });
    }
});

router.post('/supplier', async(req, res) => {
    try {
        console.log('Adding supplier with data:', req.body);
        const { SupplierName, ContactDetails } = req.body;

        if (!SupplierName) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['SupplierName']
            });
        }

        const result = await query(
            'INSERT INTO Supplier (SupplierName, ContactDetails) VALUES (?, ?)', [SupplierName, ContactDetails || null]
        );

        console.log('Supplier added successfully:', result);
        res.json({
            SupplierID: result.insertId,
            SupplierName,
            ContactDetails
        });
    } catch (error) {
        console.error('Error in POST /supplier route:', error);
        res.status(500).json({
            error: 'Error adding supplier',
            details: error.message
        });
    }
});

router.put('/supplier/:id', async(req, res) => {
    try {
        const { SupplierName, ContactDetails } = req.body;
        await query(
            'UPDATE Supplier SET SupplierName = ?, ContactDetails = ? WHERE SupplierID = ?', [SupplierName, ContactDetails, req.params.id]
        );
        res.json({ message: 'Supplier updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating supplier' });
    }
});

router.delete('/supplier/:id', async(req, res) => {
    try {
        await query('DELETE FROM Supplier WHERE SupplierID = ?', [req.params.id]);
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting supplier' });
    }
});

// Branches routes
router.get('/branch', async(req, res) => {
    try {
        console.log('Fetching branches...');
        const branches = await query(`
            SELECT b.*, e.Name as ManagerName 
            FROM Branch b 
            LEFT JOIN Employee e ON b.ManagerID = e.EmployeeID
        `);
        console.log('Branches fetched:', branches);
        res.json(branches);
    } catch (error) {
        console.error('Error in /branch route:', error);
        res.status(500).json({
            error: 'Error fetching branches',
            details: error.message
        });
    }
});

router.post('/branch', async(req, res) => {
    try {
        console.log('Adding branch with data:', req.body);
        const { Location, ManagerID } = req.body;

        if (!Location) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['Location']
            });
        }

        const result = await query(
            'INSERT INTO Branch (Location, ManagerID) VALUES (?, ?)', [Location, ManagerID || null]
        );

        console.log('Branch added successfully:', result);
        res.json({
            BranchID: result.insertId,
            Location,
            ManagerID
        });
    } catch (error) {
        console.error('Error in POST /branch route:', error);
        res.status(500).json({
            error: 'Error adding branch',
            details: error.message
        });
    }
});

router.put('/branch/:id', async(req, res) => {
    try {
        const { Location, ManagerID } = req.body;
        await query(
            'UPDATE Branch SET Location = ?, ManagerID = ? WHERE BranchID = ?', [Location, ManagerID, req.params.id]
        );
        res.json({ message: 'Branch updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating branch' });
    }
});

router.delete('/branch/:id', async(req, res) => {
    try {
        await query('DELETE FROM Branch WHERE BranchID = ?', [req.params.id]);
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting branch' });
    }
});

// Customers routes
router.get('/customer', async(req, res) => {
    try {
        console.log('Fetching customers...');
        const customers = await query(`
            SELECT c.CustomerID, 
                   c.Name,
                   c.LoyaltyPoints,
                   c.Address,
                   c.PhoneNumber,
                   c.Email,
                   COALESCE(SUM(t.TotalAmount), 0) as TotalSpent
            FROM Customer c
            LEFT JOIN \`Transaction\` t ON c.CustomerID = t.CustomerID
            GROUP BY c.CustomerID, c.Name, c.LoyaltyPoints, c.Address, c.PhoneNumber, c.Email
        `);
        console.log('Customers fetched:', customers);

        if (!customers) {
            console.log('No customers found');
            return res.json([]);
        }

        console.log('Sending response with customers:', customers);
        res.json(customers);
    } catch (error) {
        console.error('Error in /customer route:', error);
        res.status(500).json({
            error: 'Error fetching customers',
            details: error.message,
            sql: error.sql
        });
    }
});

router.post('/customer', async(req, res) => {
    try {
        console.log('Adding customer with data:', req.body);
        const { Name, LoyaltyPoints, Address, PhoneNumber, Email } = req.body;

        if (!Name || !Address) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['Name', 'Address']
            });
        }

        const result = await query(
            'INSERT INTO Customer (Name, LoyaltyPoints, Address, PhoneNumber, Email) VALUES (?, ?, ?, ?, ?)', [Name, LoyaltyPoints || 0, Address, PhoneNumber || null, Email || null]
        );

        console.log('Customer added successfully:', result);
        res.json({
            CustomerID: result.insertId,
            Name,
            LoyaltyPoints: LoyaltyPoints || 0,
            Address,
            PhoneNumber,
            Email
        });
    } catch (error) {
        console.error('Error in POST /customer route:', error);
        res.status(500).json({
            error: 'Error adding customer',
            details: error.message
        });
    }
});

// Inventory routes
router.get('/inventory', async(req, res) => {
    try {
        console.log('Fetching inventory...');
        const inventory = await query(`
            SELECT i.*, p.ProductName 
            FROM Inventory i
            LEFT JOIN Product p ON i.ProductID = p.ProductID
        `);
        console.log('Inventory fetched:', inventory);
        res.json(inventory);
    } catch (error) {
        console.error('Error in /inventory route:', error);
        res.status(500).json({
            error: 'Error fetching inventory',
            details: error.message
        });
    }
});

router.post('/inventory', async(req, res) => {
    try {
        console.log('Adding inventory with data:', req.body);
        const { ProductID, Quantity } = req.body;

        if (!ProductID || !Quantity) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['ProductID', 'Quantity']
            });
        }

        const result = await query(
            'INSERT INTO Inventory (ProductID, Quantity) VALUES (?, ?)', [ProductID, Quantity]
        );

        console.log('Inventory added successfully:', result);
        res.json({
            InventoryID: result.insertId,
            ProductID,
            Quantity
        });
    } catch (error) {
        console.error('Error in POST /inventory route:', error);
        res.status(500).json({
            error: 'Error adding inventory',
            details: error.message
        });
    }
});

// Departments routes
router.get('/department', async(req, res) => {
    try {
        console.log('Fetching departments...');
        const departments = await query(`
            SELECT d.*, b.Location as BranchName 
            FROM Department d
            LEFT JOIN Branch b ON d.BranchID = b.BranchID
        `);
        console.log('Departments fetched:', departments);
        res.json(departments);
    } catch (error) {
        console.error('Error in /department route:', error);
        res.status(500).json({
            error: 'Error fetching departments',
            details: error.message
        });
    }
});

router.post('/department', async(req, res) => {
    try {
        console.log('Adding department with data:', req.body);
        const { Name, Description, BranchID } = req.body;

        if (!Name || !BranchID) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['Name', 'BranchID']
            });
        }

        const result = await query(
            'INSERT INTO Department (Name, Description, BranchID) VALUES (?, ?, ?)', [Name, Description || null, BranchID]
        );

        console.log('Department added successfully:', result);
        res.json({
            DepartmentID: result.insertId,
            Name,
            Description,
            BranchID
        });
    } catch (error) {
        console.error('Error in POST /department route:', error);
        res.status(500).json({
            error: 'Error adding department',
            details: error.message
        });
    }
});

// Payroll routes
router.get('/payroll', async(req, res) => {
    try {
        console.log('Fetching payroll records...');
        const payrolls = await query(`
            SELECT p.*, e.Name as EmployeeName 
            FROM Payroll p
            LEFT JOIN Employee e ON p.EmployeeID = e.EmployeeID
        `);
        console.log('Payroll records fetched:', payrolls);
        res.json(payrolls);
    } catch (error) {
        console.error('Error in /payroll route:', error);
        res.status(500).json({
            error: 'Error fetching payroll records',
            details: error.message
        });
    }
});

router.post('/payroll', async(req, res) => {
    try {
        console.log('Adding payroll record with data:', req.body);
        const { EmployeeID, Salary, StartDate, EndDate } = req.body;

        if (!EmployeeID || !Salary || !StartDate) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['EmployeeID', 'Salary', 'StartDate']
            });
        }

        const result = await query(
            'INSERT INTO Payroll (EmployeeID, Salary, StartDate, EndDate) VALUES (?, ?, ?, ?)', [EmployeeID, Salary, StartDate, EndDate || null]
        );

        console.log('Payroll record added successfully:', result);
        res.json({
            PayrollID: result.insertId,
            EmployeeID,
            Salary,
            StartDate,
            EndDate
        });
    } catch (error) {
        console.error('Error in POST /payroll route:', error);
        res.status(500).json({
            error: 'Error adding payroll record',
            details: error.message
        });
    }
});

router.put('/payroll/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { EmployeeID, Salary, StartDate, EndDate } = req.body;

        if (!EmployeeID || !Salary || !StartDate) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['EmployeeID', 'Salary', 'StartDate']
            });
        }

        await query(
            'UPDATE Payroll SET EmployeeID = ?, Salary = ?, StartDate = ?, EndDate = ? WHERE PayrollID = ?', [EmployeeID, Salary, StartDate, EndDate || null, id]
        );

        res.json({
            PayrollID: id,
            EmployeeID,
            Salary,
            StartDate,
            EndDate
        });
    } catch (error) {
        console.error('Error in PUT /payroll route:', error);
        res.status(500).json({
            error: 'Error updating payroll record',
            details: error.message
        });
    }
});

router.delete('/payroll/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM Payroll WHERE PayrollID = ?', [id]);
        res.json({ message: 'Payroll record deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /payroll route:', error);
        res.status(500).json({
            error: 'Error deleting payroll record',
            details: error.message
        });
    }
});

// Use order routes
router.use('/order', orderRoutes);

// Report routes
router.get('/reports/low-stock-products', async(req, res) => {
    try {
        console.log('Fetching low stock products report...');
        const lowStockProducts = await query(`
            SELECT p.*, i.Quantity, 
                   CASE 
                       WHEN i.Quantity <= 10 THEN 'Critical'
                       WHEN i.Quantity <= 20 THEN 'Low'
                       ELSE 'Normal'
                   END as StockStatus
            FROM Product p
            JOIN Inventory i ON p.ProductID = i.ProductID
            WHERE i.Quantity <= 20
            ORDER BY i.Quantity ASC
        `);
        console.log('Low stock products fetched:', lowStockProducts);

        // Convert data to CSV format
        const csvData = convertToCSV(lowStockProducts);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=low-stock-products.csv');

        // Send the CSV file
        res.send(csvData);
    } catch (error) {
        console.error('Error in /reports/low-stock-products route:', error);
        res.status(500).json({
            error: 'Error generating low stock products report',
            details: error.message
        });
    }
});

// Helper function to convert data to CSV format
function convertToCSV(data) {
    if (!data || data.length === 0) {
        return '';
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape values that contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}

router.get('/reports/employees-no-payroll', async(req, res) => {
    try {
        console.log('Fetching employees without payroll records...');
        const employees = await query(`
            SELECT e.EmployeeID, e.Name, e.Position, e.PhoneNumber,
                   b.Location as BranchName
            FROM Employee e
            LEFT JOIN Branch b ON e.BranchID = b.BranchID
            WHERE NOT EXISTS (
                SELECT 1 FROM Payroll p 
                WHERE p.EmployeeID = e.EmployeeID
            )
            ORDER BY e.Name ASC
        `);
        // console.log('Employees without payroll fetched:', employees);

        // Convert data to CSV format
        const csvData = convertToCSV(employees);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees-no-payroll.csv');

        // Send the CSV file
        res.send(csvData);
    } catch (error) {
        // console.error('Error in /reports/employees-no-payroll route:', error);
        res.status(500).json({
            error: 'Error generating employees without payroll report',
            details: error.message
        });
    }
});

router.get('/reports/total-revenue-per-customer', async(req, res) => {
    try {
        console.log('Fetching total revenue per customer report...');
        const revenueData = await query(`
            SELECT c.Name as CustomerName,
                   SUM(t.TotalAmount) as TotalRevenue,
                   COUNT(t.TransactionID) as TransactionCount
            FROM Customer c
            LEFT JOIN \`Transaction\` t ON c.CustomerID = t.CustomerID
            GROUP BY c.CustomerID, c.Name
            ORDER BY TotalRevenue DESC
        `);
        // Convert data to CSV format
        const csvData = convertToCSV(revenueData);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees-no-payroll.csv');

        // Send the CSV file
        res.send(csvData);
    } catch (error) {
        console.error('Error in /reports/total-revenue-per-customer route:', error);
        res.status(500).json({
            error: 'Error generating total revenue per customer report',
            details: error.message
        });
    }
});

router.get('/reports/employees-with-branch-department', async(req, res) => {
    try {
        console.log('Fetching employees with branch and department details...');
        const employees = await query(`
            SELECT e.EmployeeID, e.Name, e.Position, e.PhoneNumber,
                   b.Location as BranchName,
                   d.Name as DepartmentName
            FROM Employee e
            LEFT JOIN Branch b ON e.BranchID = b.BranchID
            LEFT JOIN Department d ON b.BranchID = d.BranchID
            ORDER BY e.Name ASC
        `);
        // console.log('Employees with branch and department details fetched:', employees);
        // Convert data to CSV format
        const csvData = convertToCSV(employees);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees-no-payroll.csv');

        // Send the CSV file
        res.send(csvData);
    } catch (error) {
        console.error('Error in /reports/employees-with-branch-department route:', error);
        res.status(500).json({
            error: 'Error generating employees with branch and department report',
            details: error.message
        });
    }
});

router.get('/reports/orders-with-product-details', async(req, res) => {
    try {
        console.log('Fetching orders with product details...');
        const orders = await query(`
            SELECT o.OrderID, o.OrderDate, o.DeliveryDate, o.Status,
                   c.Name as CustomerName,
                   e.Name as EmployeeName,
                   p.ProductName, p.Price,
                   o.Quantity,
                   (p.Price * o.Quantity) as TotalAmount
            FROM \`Order\` o
            LEFT JOIN Customer c ON o.CustomerID = c.CustomerID
            LEFT JOIN Employee e ON o.EmployeeID = e.EmployeeID
            LEFT JOIN Product p ON o.ProductID = p.ProductID
            ORDER BY o.OrderDate DESC
        `);
        // console.log('Orders with product details fetched:', orders);
        // Convert data to CSV format
        const csvData = convertToCSV(orders);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees-no-payroll.csv');

        // Send the CSV file
        res.send(csvData);
    } catch (error) {
        // console.error('Error in /reports/orders-with-product-details route:', error);
        res.status(500).json({
            error: 'Error generating orders with product details report',
            details: error.message
        });
    }
});

router.get('/reports/total-quantity-per-category', async(req, res) => {
    try {
        console.log('Fetching total quantity per category...');
        const categories = await query(`
            SELECT pc.CategoryName,
                   SUM(p.QuantityInStock) as TotalQuantity,
                   COUNT(p.ProductID) as ProductCount
            FROM ProductCategory pc
            LEFT JOIN Product p ON pc.CategoryID = p.CategoryID
            GROUP BY pc.CategoryID, pc.CategoryName
            ORDER BY TotalQuantity DESC
        `);
        // console.log('Total quantity per category fetched:', categories);
        // Convert data to CSV format
        const csvData = convertToCSV(categories);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees-no-payroll.csv');

        // Send the CSV file
        res.send(csvData);
    } catch (error) {
        console.error('Error in /reports/total-quantity-per-category route:', error);
        res.status(500).json({
            error: 'Error generating total quantity per category report',
            details: error.message
        });
    }
});

router.get('/reports/high-spending-customers', async(req, res) => {
    try {
        console.log('Fetching high spending customers...');
        const customers = await query(`
            SELECT c.CustomerID, c.Name, c.Email, c.PhoneNumber,
                   COUNT(t.TransactionID) as TransactionCount,
                   SUM(t.TotalAmount) as TotalSpent,
                   MAX(t.Date) as LastPurchaseDate
            FROM Customer c
            LEFT JOIN \`Transaction\` t ON c.CustomerID = t.CustomerID
            GROUP BY c.CustomerID, c.Name, c.Email, c.PhoneNumber
            HAVING TotalSpent > 1000
            ORDER BY TotalSpent DESC
        `);
        console.log('High spending customers fetched:', customers);
        // Convert data to CSV format
        const csvData = convertToCSV(customers);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees-no-payroll.csv');

        // Send the CSV file
        res.send(csvData);
    } catch (error) {
        console.error('Error in /reports/high-spending-customers route:', error);
        res.status(500).json({
            error: 'Error generating high spending customers report',
            details: error.message
        });
    }
});

module.exports = router;