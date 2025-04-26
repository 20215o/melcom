const pool = require('../config/db');

const employeeService = {
    getAllEmployees: async() => {
        const [rows] = await pool.query('SELECT * FROM Employee');
        return rows;
    },

    getEmployeeById: async(id) => {
        const [rows] = await pool.query('SELECT * FROM Employee WHERE EmployeeID = ?', [id]);
        return rows[0];
    },

    createEmployee: async(employee) => {
        const { EmployeeName, Position, Phone, Email, Address, HireDate, Salary } = employee;
        const [result] = await pool.query(
            'INSERT INTO Employee (EmployeeName, Position, Phone, Email, Address, HireDate, Salary) VALUES (?, ?, ?, ?, ?, ?, ?)', [EmployeeName, Position, Phone, Email, Address, HireDate, Salary]
        );
        return result.insertId;
    },

    updateEmployee: async(id, employee) => {
        const { EmployeeName, Position, Phone, Email, Address, HireDate, Salary } = employee;
        await pool.query(
            'UPDATE Employee SET EmployeeName = ?, Position = ?, Phone = ?, Email = ?, Address = ?, HireDate = ?, Salary = ? WHERE EmployeeID = ?', [EmployeeName, Position, Phone, Email, Address, HireDate, Salary, id]
        );
    },

    deleteEmployee: async(id) => {
        await pool.query('DELETE FROM Employee WHERE EmployeeID = ?', [id]);
    }
};

module.exports = employeeService;