# Melcom Retail System - Server & Frontend

Welcome to the **Melcom Retail Management System**!
This project is a full-stack application using **Node.js**, **Express.js**, **MySQL (ScaleGrid)**, and a simple **HTML/JS frontend**.

---

## Project Structure

```
├── server.js            # Express server entry point
├── routes/
│   └── apiRoutes.js     # API routes for handling CRUD operations
├── utils/
│   ├── db.js            # Database connection pool
│   └── dbUtils.js       # Helper for querying DB with connection management
├── public/
│   └── index.html       # Frontend HTML (plus CSS/JS if needed)
├── melcom-ssl-public-cert.cert  # SSL certificate for ScaleGrid DB (required)
├── .env                 # Environment variables (DB credentials, etc.)
```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://your-repo-url.git
cd melcom-retail-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file:
```bash
DB_HOST=your-scalegrid-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=Melcom
```

Or let it use the default values hardcoded.

> **Important:** Make sure `melcom-ssl-public-cert.cert` exists in the root directory for secure SSL DB connection.

### 4. Start the server
```bash
node server.js
```
The server runs on `http://localhost:3000` (or your specified `PORT`).


---

## Important Notes

### SSL Connection to ScaleGrid
- `db.js` uses SSL with ScaleGrid.
- The SSL certificate must be present.
- You can modify `db.js` to fallback without SSL for local testing.

### Common Issues
| Issue | Solution |
|:------|:---------|
| Server pending response | Check DB SSL certificate, DB credentials, and network access. |
| Branch dropdown not populating in Employee modal | Use `loadBranchesForEmployeeDropdown()` instead of `loadBranches()` inside the Employee modal logic. |

---

## Available API Endpoints
- `GET /api/category` - List product categories
- `GET /api/product` - List products
- `GET /api/employee` - List employees
- `GET /api/branch` - List branches
- `GET /api/customer` - List customers
- `GET /api/inventory` - List inventory
- `GET /api/transaction` - List transactions
- ...plus full CRUD (`POST`, `PUT`, `DELETE`) for each

---

## Deployment
- This server is ready for deployment on platforms like **Render.com**, **Railway.app**, or **Heroku**.
- Make sure your environment variables and SSL settings are correctly configured.

---

## Author
**Melcom Project Team**

---

## License
This project is licensed under the MIT License.

---

Happy coding! ✨

---

> _"Where Ghana Shops."_