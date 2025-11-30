// Simple wrapper para consumir el backend REST
const API_BASE = (window.__PYME_API_BASE__ || 'http://localhost:3000');

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  // Try parse JSON (some deletes return empty)
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Products
async function fetchProducts() { return apiFetch('/products'); }
async function createProduct(payload) { return apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) }); }
async function updateProductApi(id, payload) { return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
async function deleteProductApi(id) { return fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }); }

// Clients
async function fetchClients() { return apiFetch('/clients'); }
async function createClient(payload) { return apiFetch('/clients', { method: 'POST', body: JSON.stringify(payload) }); }
async function deleteClientApi(id) { return fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' }); }

// Expenses
async function fetchExpenses() { return apiFetch('/expenses'); }
async function createExpense(payload) { return apiFetch('/expenses', { method: 'POST', body: JSON.stringify(payload) }); }
async function deleteExpenseApi(id) { return fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' }); }

// Sales
async function fetchSales() { return apiFetch('/sales'); }
async function createSale(payload) { return apiFetch('/sales', { method: 'POST', body: JSON.stringify(payload) }); }
async function deleteSaleApi(id) { return fetch(`${API_BASE}/sales/${id}`, { method: 'DELETE' }); }

// Export to global
window.PymeAPI = {
  fetchProducts,
  createProduct,
  updateProductApi,
  deleteProductApi,
  fetchClients,
  createClient,
  deleteClientApi,
  fetchExpenses,
  createExpense,
  deleteExpenseApi,
  fetchSales,
  createSale,
  deleteSaleApi
};
