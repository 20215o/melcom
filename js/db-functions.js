// Base URL for API endpoints
const API_BASE_URL = 'https://melcom-retail-system.onrender.com/api';

// Generic function to fetch entities
async function fetchEntity(entityType) {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityType.toLowerCase()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${entityType}:`, error);
        throw error;
    }
}

// Generic function to add an entity
async function addEntity(entityType, data) {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityType.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error adding ${entityType}:`, error);
        throw error;
    }
}

// Generic function to update an entity
async function updateEntity(entityType, id, data) {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityType.toLowerCase()}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error updating ${entityType}:`, error);
        throw error;
    }
}

// Generic function to delete an entity
async function deleteEntity(entityType, id) {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityType.toLowerCase()}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error deleting ${entityType}:`, error);
        throw error;
    }
}

// Function to show toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Function to open modal
function openModal(modalId, title) {
    const modal = document.getElementById(modalId);
    const modalTitle = document.getElementById(`${modalId}-title`);
    modalTitle.textContent = title;
    modal.classList.remove('hidden');
}

// Function to close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    // Clear form fields
    const form = document.getElementById(`${modalId}-form`);
    if (form) {
        const inputs = form.getElementsByTagName('input');
        for (let input of inputs) {
            if (input.type !== 'button') {
                input.value = '';
            }
        }
    }
}

// Function to load dashboard data
async function loadDashboardData() {
    try {
        // Load total sales
        const transactions = await fetchEntity('Transaction');
        const totalSales = transactions.reduce((sum, t) => sum + parseFloat(t.Amount), 0);
        document.getElementById('total-sales').textContent = `GHS ${totalSales.toFixed(2)}`;

        // Load total products
        const products = await fetchEntity('Product');
        document.getElementById('total-products').textContent = products.length;

        // Load total transactions
        document.getElementById('total-transactions').textContent = transactions.length;

        // Load total employees
        const employees = await fetchEntity('Employee');
        document.getElementById('total-employees').textContent = employees.length;

        // Load sales chart data
        const salesData = {};
        products.forEach(product => {
            const productTransactions = transactions.filter(t => t.ProductID === product.ProductID);
            salesData[product.ProductName] = productTransactions.reduce((sum, t) => sum + parseFloat(t.Amount), 0);
        });

        const ctx = document.getElementById('sales-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(salesData),
                datasets: [{
                    label: 'Sales per Product',
                    data: Object.values(salesData),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'error');
    }
}

// Function to load categories
async function loadCategories() {
    try {
        const categories = await fetchEntity('Category');
        const categoryTable = document.getElementById('ProductCategory-table');
        categoryTable.innerHTML = '';

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.CategoryID}</td>
                <td>${category.CategoryName}</td>
                <td>
                    <button class="btn btn-edit" onclick="editCategory(${category.CategoryID})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteCategory(${category.CategoryID})">Delete</button>
                </td>
            `;
            categoryTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Error loading categories', 'error');
    }
}

// Function to save category
async function saveCategory() {
    const categoryId = document.getElementById('ProductCategory-id').value;
    const category = {
        CategoryName: document.getElementById('ProductCategory-name').value
    };

    try {
        if (categoryId) {
            await updateEntity('Category', parseInt(categoryId), category);
        } else {
            await addEntity('Category', category);
        }

        closeModal('ProductCategory-modal');
        loadCategories();
        showToast(`Category ${categoryId ? 'updated' : 'added'} successfully`, 'success');
    } catch (error) {
        console.error('Error saving category:', error);
        showToast('Error saving category', 'error');
    }
}

// Function to edit category
async function editCategory(id) {
    try {
        const categories = await fetchEntity('Category');
        const category = categories.find(c => c.CategoryID === id);

        if (category) {
            document.getElementById('ProductCategory-id').value = category.CategoryID;
            document.getElementById('ProductCategory-name').value = category.CategoryName;
            openModal('ProductCategory-modal', 'Edit Category');
        }
    } catch (error) {
        console.error('Error loading category:', error);
        showToast('Error loading category', 'error');
    }
}

// Function to delete category
async function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            await deleteEntity('Category', id);
            loadCategories();
            showToast('Category deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting category:', error);
            showToast('Error deleting category', 'error');
        }
    }
}

// Load dashboard data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();

    // Add event listeners for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section');

            // Hide all sections
            document.querySelectorAll('.content-section').forEach(s => {
                s.classList.add('hidden');
            });

            // Show selected section
            document.getElementById(section).classList.remove('hidden');

            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            e.target.classList.add('active');

            // Load section data
            switch (section) {
                case 'ProductCategory':
                    loadCategories();
                    break;
                case 'Employee':
                    loadEmployees();
                    break;
                    // Add other cases as needed
            }
        });
    });
});