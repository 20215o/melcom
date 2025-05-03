# Melcom Retail System - Full-Stack Application

Welcome to the **Melcom Retail Management System**! 
This project is a full-stack solution designed to manage retail operations for Melcom, one of Ghana's leading retail companies. It features a robust **Node.js + Express** backend connected to a **MySQL** database (hosted on **ScaleGrid**) and a dynamic **HTML/JavaScript** frontend interface.

---

## Changelog

### 2024-06-09
- Updated all frontend API base URLs from `http://localhost:3000/api` to `https://melcom-retail-system.onrender.com/api` to support deployment on Render.com.
- Ensured all authentication and entity management features now communicate with the deployed backend.

---

## Project Structure Overview

```
├── server.js                  # Express server setup (root)
├── db.js                      # MySQL database pool and connection settings (root)
├── routes/
│   └── apiRoutes.js           # API routes handling CRUD operations for all entities
├── utils/
│   └── dbUtils.js             # Utility for executing queries safely
├── public/
│   └── index.html             # Main frontend dashboard and UI (root/public)
├── melcom-ssl-public-cert.cert # SSL certificate required for ScaleGrid connection
├── .env                       # Environment variables (DB credentials, etc.)
```

---

## How to Setup and Run Locally

### 1. Clone the Repository
```bash
git clone https://your-repo-url.git
cd melcom-retail-system
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```bash
DB_HOST=your-scalegrid-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=Melcom
```

> **Note:** Default fallback credentials are already included in `db.js` for development.

### 4. Ensure SSL Certificate
Make sure `melcom-ssl-public-cert.cert` is present in the project root for secure database connections.

### 5. Start the Server
```bash
node server.js
```
or

```bash
npm start
```

The server will run at `http://localhost:3000` by default.

---

## Procedure / How It Works

1. **Frontend (`index.html`)** provides a clean admin dashboard to interact with different parts of the retail system (Categories, Products, Customers, Employees, Branches, etc.).
2. When users perform an action (e.g., Add Product, Edit Customer), **JavaScript functions** send **API calls** to the backend (`/api/...`).
3. The **Express server** (`server.js`) receives the API requests and routes them to the appropriate handler in `apiRoutes.js`.
4. **apiRoutes.js** uses **`dbUtils.js`** to safely interact with the **MySQL** database using prepared statements.
5. **db.js** defines a **MySQL2 pool** with SSL settings for secure and efficient database connections to ScaleGrid.
6. Responses (success or error) are sent back to the frontend, which updates the UI dynamically.


---

## About the Database (MySQL on ScaleGrid)

- **Database Name**: `Melcom`
- **Tables**: 
  - `ProductCategory`
  - `Product`
  - `Supplier`
  - `Employee`
  - `Branch`
  - `Customer`
  - `Order`
  - `Transaction`
  - `Inventory`
  - `Payroll`
  - `Department`

- **Relationships**:
  - Products belong to Categories and Suppliers.
  - Employees belong to Branches.
  - Orders link Customers and Products.
  - Transactions link Orders and Customers.
  - Payroll is tied to Employees.

- **Connection**:
  - The database is hosted on ScaleGrid with SSL enforced.
  - The Node.js server connects using `mysql2/promise` with connection pooling.

- **Security**:
  - SSL certificates are mandatory.
  - Environment variables manage sensitive data.

> **Important:** Always ensure the correct database permissions and IP whitelisting in ScaleGrid settings.

---

## Key Features

- **Category Management**: Create, edit, and delete product categories.
- **Product Management**: Full CRUD operations for products linked with categories and suppliers.
- **Employee & Branch Management**: Assign employees to branches; edit employee details dynamically.
- **Customer Management**: Track customer details, loyalty points, and total spend.
- **Order and Transaction Tracking**: Record orders and payments seamlessly.
- **Inventory Management**: Monitor and update stock levels.
- **Payroll System**: Manage employee salaries and contract dates.
- **Dashboard Metrics**: Visual reporting using Chart.js (Total Sales, Products, Transactions, Employees).

---

## Authentication

The system uses token-based authentication (JWT) for secure access to all protected API endpoints. Users must log in with their email and password to receive a token, which is stored in the browser's local storage. This token is sent with every API request to verify the user's identity. If the token is missing or invalid, the user is redirected to the login page.

- **Login:** Users authenticate via the login form. On success, a JWT token is issued and stored locally.
- **Session Management:** The app checks for a valid token on every page load and API call. If the token is expired or invalid, the user is logged out automatically.
- **Logout:** Users can log out, which clears the token and user info from local storage.

## Admin vs. Normal User

The application supports two user roles:

- **Admin User:** Identified by the email `admin@gmail.com`. Admins have full access to all features, including the ability to add, edit, and delete any entity (products, categories, employees, etc.). Admin-only actions (like delete/edit buttons) are only visible to admins.
- **Normal User:** Any user other than the admin. Normal users have read-only access to most data and cannot perform administrative actions. The UI dynamically hides admin-only controls for these users.

Role switching is handled by logging in with the appropriate credentials. The UI and available actions update automatically based on the logged-in user's role.

## Responsive Design

The frontend is built with responsive design principles, ensuring usability across desktops, tablets, and mobile devices. The layout adapts to different screen sizes, with navigation, tables, and modals optimized for touch and smaller displays. CSS media queries and flexible grid layouts are used throughout the application for a seamless user experience on any device.

## Change of Host to Aiven

The backend database hosting has been migrated from ScaleGrid to **Aiven** for improved reliability and scalability. Please update your `.env` file and connection settings as follows:

```
DB_HOST=your-aiven-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=Melcom
```

- Ensure your SSL certificate and connection pool settings are compatible with Aiven's requirements.
- Update any deployment scripts or documentation to reference the new Aiven host.

---

## Important Notes and Common Issues

### SSL Connection to ScaleGrid
- Connection to the MySQL database requires SSL.
- Use the provided `melcom-ssl-public-cert.cert` for secure connectivity.

### Database Connection Failures
If the server response is stuck in "pending":
- Check if the SSL certificate path is correct.
- Validate your ScaleGrid database credentials.
- Ensure your IP is whitelisted in the ScaleGrid dashboard.
- Add `connectTimeout` to avoid indefinite hanging.

### Employee Modal Branch Dropdown Issue
Ensure you use a dedicated function to load branch options into the employee form:
```javascript
loadBranchesForEmployeeDropdown();
```
instead of mistakenly using `loadBranches()` intended for displaying branch tables.

---

## Available RESTful API Endpoints

| Method | Endpoint             | Description                     |
|:------:|:---------------------|:--------------------------------|
| GET    | /api/category         | Fetch all product categories    |
| POST   | /api/category         | Add a new category              |
| PUT    | /api/category/:id     | Update an existing category     |
| DELETE | /api/category/:id     | Delete a category               |
| GET    | /api/product          | Fetch all products              |
| GET    | /api/employee         | Fetch all employees             |
| GET    | /api/branch           | Fetch all branches              |
| GET    | /api/customer         | Fetch all customers             |
| GET    | /api/transaction      | Fetch all transactions          |
| ...    | Full CRUD for most entities |

---

## Deployment Guidelines

- Ensure environment variables are properly configured in your hosting platform (e.g., Render, Railway, or AWS Elastic Beanstalk).
- Upload your SSL certificate as a file if required by the hosting environment.
- Make sure port settings (default 3000) are handled dynamically with `process.env.PORT`.
- Enable CORS policies as needed for frontend access.


---

## Author and Credits

Developed by the **Melcom Project Development Team**.

Special thanks to contributors who designed and tested the UI, optimized SQL queries, and built robust backend services.


---

## License

This project is licensed under the **MIT License** - feel free to modify and distribute with attribution.

---

## Final Note

> _"Where Ghana Shops."_

Thank you for using Melcom Retail System! Happy building! 🚀