// Base URL for API endpoints
const API_BASE_URL = 'https://melcom-retail-system.onrender.com/api';

// Generic function to fetch entities
async function fetchEntity(entityName) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityName.toLowerCase()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Error fetching ${entityName}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${entityName}:`, error);
        showToast(`Error fetching ${entityName}: ${error.message}`, 'error');
        throw error;
    }
}

// Generic function to add an entity
async function addEntity(entityName, data) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityName.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Error adding ${entityName}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error adding ${entityName}:`, error);
        showToast(`Error adding ${entityName}: ${error.message}`, 'error');
        throw error;
    }
}

// Generic function to update an entity
async function updateEntity(entityName, id, data) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityName.toLowerCase()}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Error updating ${entityName}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error updating ${entityName}:`, error);
        showToast(`Error updating ${entityName}: ${error.message}`, 'error');
        throw error;
    }
}

// Generic function to delete an entity
async function deleteEntity(entityName, id) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${entityName.toLowerCase()}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Error deleting ${entityName}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error deleting ${entityName}:`, error);
        showToast(`Error deleting ${entityName}: ${error.message}`, 'error');
        throw error;
    }
}

// Utility function to show toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Utility function to show/hide modals
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
        modal.classList.add('show');
        modal.style.display = 'block';
    } else {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}