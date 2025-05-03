const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const pool = require('../db');

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Helper function to execute queries
async function query(sql, params = []) {
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Helper to convert array of objects to CSV
function toCSV(rows) {
    if (!rows || !rows.length) return '';
    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(',')];
    for (const row of rows) {
        csvRows.push(headers.map(h => '"' + (row[h] !== null && row[h] !== undefined ? String(row[h]).replace(/"/g, '""') : '') + '"').join(','));
    }
    return csvRows.join('\n');
}

// Categories routes
router.get('/productcategory', async(req, res) => {
    try {
        const categories = await query('SELECT * FROM ProductCategory');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

router.post('/productcategory', async(req, res) => {
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

router.put('/productcategory/:id', async(req, res) => {
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

router.delete('/productcategory/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM ProductCategory WHERE CategoryID = ?', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
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
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

router.post('/product', async(req, res) => {
    try {
        const { ProductName, CategoryID, Price, QuantityInStock, SupplierID } = req.body;
        const result = await query(
            'INSERT INTO Product (ProductName, CategoryID, Price, QuantityInStock, SupplierID) VALUES (?, ?, ?, ?, ?)', [ProductName, CategoryID, Price, QuantityInStock, SupplierID]
        );
        res.json({
            ProductID: result.insertId,
            ProductName,
            CategoryID,
            Price,
            QuantityInStock,
            SupplierID
        });
    } catch (error) {
        res.status(500).json({ error: 'Error adding product' });
    }
});

router.put('/product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { ProductName, CategoryID, Price, QuantityInStock, SupplierID } = req.body;
        await query(
            'UPDATE Product SET ProductName = ?, CategoryID = ?, Price = ?, QuantityInStock = ?, SupplierID = ? WHERE ProductID = ?', [ProductName, CategoryID, Price, QuantityInStock, SupplierID, id]
        );
        res.json({
            ProductID: id,
            ProductName,
            CategoryID,
            Price,
            QuantityInStock,
            SupplierID
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
});

router.delete('/product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM Product WHERE ProductID = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

// Employees routes
router.get('/employee', async(req, res) => {
    try {
        const employees = await query(`
            SELECT e.*, b.Location as BranchName 
            FROM Employee e 
            LEFT JOIN Branch b ON e.BranchID = b.BranchID
        `);
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Error fetching employees' });
    }
});

router.post('/employee', async(req, res) => {
    try {
        const { Name, Position, PhoneNumber, BranchID } = req.body;
        const result = await query(
            'INSERT INTO Employee (Name, Position, PhoneNumber, BranchID) VALUES (?, ?, ?, ?)', [Name, Position, PhoneNumber, BranchID]
        );
        res.json({
            EmployeeID: result.insertId,
            Name,
            Position,
            PhoneNumber,
            BranchID
        });
    } catch (error) {
        res.status(500).json({ error: 'Error adding employee' });
    }
});

router.put('/employee/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { Name, Position, PhoneNumber, BranchID } = req.body;
        await query(
            'UPDATE Employee SET Name = ?, Position = ?, PhoneNumber = ?, BranchID = ? WHERE EmployeeID = ?', [Name, Position, PhoneNumber, BranchID, id]
        );
        res.json({
            EmployeeID: id,
            Name,
            Position,
            PhoneNumber,
            BranchID
        });
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

// Transactions routes
router.get('/transaction', async(req, res) => {
    try {
        console.log('Fetching transactions...');
        const transactions = await query(`
            SELECT t.*, o.OrderID, o.CustomerID, c.Name as CustomerName
            FROM \`transaction\` t
            LEFT JOIN \`order\` o ON t.OrderID = o.OrderID
            LEFT JOIN customer c ON o.CustomerID = c.CustomerID
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
        const { OrderID, CustomerID, PaymentType, Amount, Date } = req.body;

        if (!OrderID || !CustomerID || !PaymentType || !Amount || !Date) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['OrderID', 'CustomerID', 'PaymentType', 'TotalAmount', 'Date']
            });
        }

        const result = await query(
            'INSERT INTO \`Transaction\` (OrderID, CustomerID, PaymentType, TotalAmount, Date) VALUES (?, ?, ?, ?, ?)', [OrderID, CustomerID, PaymentType, Amount, Date]
        );

        console.log('Transaction added successfully:', result);
        res.json({
            TransactionID: result.insertId,
            OrderID,
            CustomerID,
            PaymentType,
            Amount,
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
        const { OrderID, CustomerID, PaymentType, Amount, Date } = req.body;

        if (!OrderID || !CustomerID || !PaymentType || !Amount || !Date) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['OrderID', 'CustomerID', 'PaymentType', 'TotalAmount', 'Date']
            });
        }

        const result = await query(
            'UPDATE \`Transaction\` SET OrderID = ?, CustomerID = ?, PaymentType = ?, TotalAmount = ?, Date = ? WHERE TransactionID = ?', [OrderID, CustomerID, PaymentType, Amount, Date, id]
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
                   COALESCE(SUM(t.Amount), 0) as TotalSpent
            FROM customer c
            LEFT JOIN \`order\` o ON c.CustomerID = o.CustomerID
            LEFT JOIN \`transaction\` t ON o.OrderID = t.OrderID
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

// Dashboard routes
router.get('/dashboard', async(req, res) => {
    try {
        // Get total sales
        const [sales] = await pool.query(`
            SELECT SUM(Amount) as totalSales 
            FROM transaction
        `);

        // Get total products
        const [products] = await pool.query(`
            SELECT COUNT(*) as totalProducts 
            FROM \`Product\`
        `);

        // Get total transactions
        const [transactions] = await pool.query(`
            SELECT COUNT(*) as totalTransactions 
            FROM transaction
        `);

        // Get total employees
        const [employees] = await pool.query(`
            SELECT COUNT(*) as totalEmployees 
            FROM \`Employee\`
        `);

        // Get sales by product category (simplified to show total sales)
        const [categorySales] = await pool.query(`
            SELECT 'All Categories' as CategoryName, SUM(t.Amount) as totalSales
            FROM \`transaction\` t
            JOIN \`order\` o ON t.OrderID = o.OrderID
        `);

        res.json({
            totalSales: sales[0].totalSales || 0,
            totalProducts: products[0].totalProducts || 0,
            totalTransactions: transactions[0].totalTransactions || 0,
            totalEmployees: employees[0].totalEmployees || 0,
            categorySales
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Error fetching dashboard data' });
    }
});

// Orders routes
router.get('/order', async(req, res) => {
    try {
        const orders = await query(`
            SELECT o.*, c.Name as CustomerName, e.Name as EmployeeName
            FROM \`order\` o
            LEFT JOIN customer c ON o.CustomerID = c.CustomerID
            LEFT JOIN employee e ON o.EmployeeID = e.EmployeeID
        `);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

async function loadOrders() {
    try {
        const orders = await fetchEntity('order');
        const tableBody = document.getElementById('Order-table');
        tableBody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.OrderID}</td>
                <td>${order.CustomerName || order.CustomerID || 'N/A'}</td>
                <td>${order.EmployeeName || order.EmployeeID || 'N/A'}</td>
                <td>${order.OrderDate || 'N/A'}</td>
                <td>${order.DeliveryDate || 'N/A'}</td>
                <td>${order.Status || 'N/A'}</td>
                <td>${order.ProductName || order.ProductID || 'N/A'}</td>
                <td>${order.Quantity || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editOrder(${order.OrderID})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.OrderID})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function loadTransactions() {
    try {
        const transactions = await fetchEntity('transaction');
        const tableBody = document.getElementById('Transaction-table');
        tableBody.innerHTML = '';

        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.TransactionID}</td>
                <td>${transaction.OrderID || 'N/A'}</td>
                <td>${transaction.CustomerName || transaction.CustomerID || 'N/A'}</td>
                <td>${transaction.ProductName || transaction.ProductID || 'N/A'}</td>
                <td>${transaction.payment_type || 'N/A'}</td>
                <td>${transaction.transaction_date || 'N/A'}</td>
                <td>${transaction.Amount || transaction.TotalAmount || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTransaction(${transaction.TransactionID})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${transaction.TransactionID})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Reports route
router.get('/report/:type', async(req, res) => {
    const { type } = req.params;
    try {
        let result;
        switch (type) {
            case 'total-revenue-per-customer':
                result = await query(`
                    SELECT c.Name as CustomerName, SUM(t.Amount) as TotalRevenue
                    FROM customer c
                    LEFT JOIN \`order\` o ON c.CustomerID = o.CustomerID
                    LEFT JOIN transaction t ON o.OrderID = t.OrderID
                    GROUP BY c.CustomerID, c.Name
                `);
                break;
            case 'low-stock-products':
                result = await query(`
                    SELECT ProductName, QuantityInStock
                    FROM product
                    WHERE QuantityInStock < 10
                `);
                break;
            case 'employees-with-branch-department':
                result = await query(`
                    SELECT e.Name as EmployeeName, b.Location as Branch, d.Name as Department
                    FROM employee e
                    LEFT JOIN branch b ON e.BranchID = b.BranchID
                    LEFT JOIN department d ON d.BranchID = b.BranchID
                `);
                break;
            case 'orders-with-product-details':
                result = await query(`
                    SELECT o.OrderID, c.Name as CustomerName, e.Name as EmployeeName, o.OrderDate, o.Status, p.ProductName, p.Price
                    FROM \`order\` o
                    LEFT JOIN customer c ON o.CustomerID = c.CustomerID
                    LEFT JOIN employee e ON o.EmployeeID = e.EmployeeID
                    LEFT JOIN product p ON p.ProductID = (SELECT ProductID FROM product LIMIT 1)
                `);
                break;
            case 'total-quantity-per-category':
                result = await query(`
                    SELECT pc.CategoryName, SUM(p.QuantityInStock) as TotalQuantity
                    FROM productcategory pc
                    LEFT JOIN product p ON pc.CategoryID = p.CategoryID
                    GROUP BY pc.CategoryID, pc.CategoryName
                `);
                break;
            case 'employees-no-payroll':
                result = await query(`
                    SELECT e.Name as EmployeeName, e.Position
                    FROM employee e
                    LEFT JOIN payroll p ON e.EmployeeID = p.EmployeeID
                    WHERE p.EmployeeID IS NULL
                `);
                break;
            case 'high-spending-customers':
                result = await query(`
                    SELECT c.Name as CustomerName, SUM(t.Amount) as TotalSpent
                    FROM customer c
                    LEFT JOIN \`order\` o ON c.CustomerID = o.CustomerID
                    LEFT JOIN transaction t ON o.OrderID = t.OrderID
                    GROUP BY c.CustomerID, c.Name
                    HAVING TotalSpent > 1000
                `);
                break;
            default:
                return res.status(400).json({ error: 'Unknown report type' });
        }
        const csv = toCSV(result);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Error generating report' });
    }
});

module.exports = router;