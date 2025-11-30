// --- DATA STORE ---
let data = {
    products: [],
    clients: [{id: 1, name: 'Cliente General', email: '', phone: '', totalSpent: 0}],
    sales: [],
    expenses: []
};

const TAX_RATE = 0.19;

// --- INIT ---
window.onload = function() {
    loadData();
    updateDashboard();
    router('dashboard');
};

// --- LOCAL STORAGE MANAGER ---
function saveData() {
    localStorage.setItem('pymeData', JSON.stringify(data));
    updateDashboard(); // Refresh stats whenever data changes
}

function loadData() {
    const stored = localStorage.getItem('pymeData');
    if (stored) {
        try {
            data = JSON.parse(stored);
        } catch(e) {
            console.error('Error parsing stored data, seeding datos.');
            seedData();
        }
    } else {
        // Seed some fake data for demo
        seedData();
    }
}

function seedData() {
    data.products = [
        {id: 1715, name: 'Camiseta Básica', category: 'Ropa', stock: 50, price: 99900, cost: 45000},
        {id: 1716, name: 'Pantalón Jean', category: 'Ropa', stock: 20, price: 180000, cost: 90000},
        {id: 1717, name: 'Zapatillas Deportivas', category: 'Calzado', stock: 5, price: 350000, cost: 175000},
        {id: 1718, name: 'Gorra Logo', category: 'Accesorios', stock: 100, price: 50000, cost: 15000},
    ];
    data.expenses = [
        {id: 1, description: 'Alquiler Local', amount: 2000000, category: 'Operativo', date: '2023-10-01'},
        {id: 2, description: 'Internet', amount: 120000, category: 'Servicios', date: '2023-10-05'}
    ];
    saveData();
}

// --- CONFIRMATION LOGIC (NEW) ---
let pendingAction = null;

function showConfirmModal(message, action) {
    const modal = document.getElementById('confirm-modal');
    if(!modal) return;
    document.getElementById('confirm-message').innerText = message;
    pendingAction = action;
    modal.classList.remove('hidden');
}

function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if(!modal) return;
    modal.classList.add('hidden');
    pendingAction = null;
}

function executeConfirmAction() {
    if (pendingAction) {
        pendingAction();
    }
    closeConfirmModal();
}

function resetData() {
    showConfirmModal('Se borrarán todos los datos y se recargará la página.', () => {
        localStorage.removeItem('pymeData');
        location.reload();
    });
}

// --- ROUTING / UI ---
function router(viewId) {
    // Hide all views
    document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
    // Show selected view
    const view = document.getElementById(`view-${viewId}`);
    if (view) view.classList.remove('hidden');
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    const nav = document.getElementById(`nav-${viewId}`);
    if(nav) nav.classList.add('active');

    // Trigger specific renderers
    if(viewId === 'inventory') renderInventory();
    if(viewId === 'pos') initPOS();
    if(viewId === 'sales') renderSalesHistory();
    if(viewId === 'expenses') renderExpenses();
    if(viewId === 'clients') renderClients();
}

// --- FORMATTERS ---
const formatCurrency = (num) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const formatDate = (dateString) => {
    if(!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-CO');
};

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    const colors = type === 'success' ? 'bg-emerald-500' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');
    
    toast.className = `${colors} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0 flex items-center gap-2`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle')}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    // Remove
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- MODALS ---
function openModal(modalId) {
    const m = document.getElementById(modalId);
    if(m) m.classList.remove('hidden');
}
function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if(m) m.classList.add('hidden');
}

// --- DASHBOARD LOGIC ---
function updateDashboard() {
    const totalSales = data.sales.reduce((acc, curr) => acc + curr.total, 0);
    const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    let grossProfit = 0;
    data.sales.forEach(sale => {
        sale.items.forEach(item => {
            const product = data.products.find(p => p.id === item.id);
            const cost = product ? product.cost : (item.price * 0.5);
            grossProfit += (item.price - cost) * item.qty;
        });
    });

    const netProfit = grossProfit - totalExpenses;
    const lowStockCount = data.products.filter(p => p.stock < 10).length;

    const dashSales = document.getElementById('dash-sales');
    const dashExpenses = document.getElementById('dash-expenses');
    const dashProfit = document.getElementById('dash-profit');
    const dashLow = document.getElementById('dash-low-stock');

    if(dashSales) dashSales.innerText = formatCurrency(totalSales);
    if(dashExpenses) dashExpenses.innerText = formatCurrency(totalExpenses);
    if(dashProfit) dashProfit.innerText = formatCurrency(netProfit);
    if(dashLow) dashLow.innerText = lowStockCount;

    // Latest Sales
    const tbody = document.getElementById('dash-latest-sales');
    if(tbody) {
        tbody.innerHTML = '';
        data.sales.slice(-5).reverse().forEach(sale => {
            tbody.innerHTML += `
                <tr class="bg-white border-b">
                    <td class="px-4 py-2 font-medium text-gray-900">#${sale.id}</td>
                    <td class="px-4 py-2 text-gray-500">${new Date(sale.date).toLocaleDateString()}</td>
                    <td class="px-4 py-2 text-right font-bold text-gray-700">${formatCurrency(sale.total)}</td>
                </tr>
            `;
        });
    }

    // Top Products (simple frequency count)
    const productCount = {};
    data.sales.forEach(s => s.items.forEach(i => {
        productCount[i.name] = (productCount[i.name] || 0) + i.qty;
    }));
    const topProducts = Object.entries(productCount).sort((a,b) => b[1] - a[1]).slice(0,5);
    
    const prodList = document.getElementById('dash-top-products');
    if(prodList) {
        prodList.innerHTML = '';
        topProducts.forEach(([name, count]) => {
            prodList.innerHTML += `
                <li class="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <span class="font-medium text-gray-700">${name}</span>
                    <span class="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs font-bold">${count} sold</span>
                </li>
            `;
        });
    }
}

// --- INVENTORY LOGIC ---
function renderInventory() {
    const tbody = document.getElementById('inventory-table-body');
    const filterEl = document.getElementById('inventory-search');
    const filter = filterEl ? filterEl.value.toLowerCase() : '';
    if(!tbody) return;
    tbody.innerHTML = '';

    data.products.forEach(p => {
        if(p.name.toLowerCase().includes(filter)) {
            const stockClass = p.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-600';
            tbody.innerHTML += `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">${p.name}</td>
                    <td class="px-6 py-4">${p.category}</td>
                    <td class="px-6 py-4">${formatCurrency(p.price)}</td>
                    <td class="px-6 py-4">${formatCurrency(p.cost)}</td>
                    <td class="px-6 py-4 text-center ${stockClass}">${p.stock}</td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:text-red-700 ml-2"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }
    });
}

const inventorySearchEl = () => document.getElementById('inventory-search');
if(inventorySearchEl()) inventorySearchEl().addEventListener('input', renderInventory);

function saveProduct(e) {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const cat = document.getElementById('prod-cat').value;
    const stock = parseInt(document.getElementById('prod-stock').value);
    const price = parseFloat(document.getElementById('prod-price').value);
    const cost = parseFloat(document.getElementById('prod-cost').value);

    const newProd = {
        id: Date.now(),
        name, category: cat, stock, price, cost
    };

    data.products.push(newProd);
    saveData();
    closeModal('product-modal');
    const form = document.getElementById('product-form');
    if(form) form.reset();
    renderInventory();
    showToast('Producto agregado correctamente');
}

function deleteProduct(id) {
    showConfirmModal('¿Estás seguro de eliminar este producto del inventario?', () => {
        data.products = data.products.filter(p => p.id !== id);
        saveData();
        renderInventory();
        showToast('Producto eliminado', 'error');
    });
}

// --- POS / SALES LOGIC ---
let cart = [];

function initPOS() {
    renderPosProducts();
    updateCartUI();
    
    // Populate Client Select
    const clientSelect = document.getElementById('pos-client-select');
    if(clientSelect) {
        clientSelect.innerHTML = '';
        data.clients.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.text = c.name;
            clientSelect.appendChild(opt);
        });
    }
}

const posSearchEl = () => document.getElementById('pos-search');
if(posSearchEl()) posSearchEl().addEventListener('input', renderPosProducts);

function renderPosProducts() {
    const grid = document.getElementById('pos-products-grid');
    const searchEl = document.getElementById('pos-search');
    const search = searchEl ? searchEl.value.toLowerCase() : '';
    if(!grid) return;
    grid.innerHTML = '';

    data.products.forEach(p => {
        if(p.name.toLowerCase().includes(search) && p.stock > 0) {
            const card = document.createElement('div');
            card.className = "bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between";
            card.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-800 line-clamp-2">${p.name}</h4>
                    <p class="text-xs text-gray-500 mt-1">${p.category}</p>
                </div>
                <div class="flex justify-between items-end mt-3">
                    <span class="text-indigo-600 font-bold">${formatCurrency(p.price)}</span>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Stock: ${p.stock}</span>
                </div>
            `;
            card.addEventListener('click', () => addToCart(p.id));
            grid.appendChild(card);
        }
    });
}

function addToCart(productId) {
    const product = data.products.find(p => p.id === productId);
    if(!product) return;
    const existingItem = cart.find(i => i.id === productId);

    if (existingItem) {
        if (existingItem.qty < product.stock) {
            existingItem.qty++;
        } else {
            showToast('No hay suficiente stock', 'error');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            maxStock: product.stock
        });
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('pos-cart-items');
    
    if(!container) return;

    if(cart.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 mt-10"><i class="fas fa-shopping-basket text-4xl mb-2"></i><br>El carrito está vacío</div>';
        const cs = document.getElementById('cart-subtotal');
        const ct = document.getElementById('cart-tax');
        const ctot = document.getElementById('cart-total');
        if(cs) cs.innerText = '$0.00';
        if(ct) ct.innerText = '$0.00';
        if(ctot) ctot.innerText = '$0.00';
        return;
    }

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        const div = document.createElement('div');
        div.className = "flex justify-between items-center bg-gray-50 p-2 rounded";
        div.innerHTML = `
            <div class="flex-1">
                <p class="text-sm font-bold text-gray-800">${item.name}</p>
                <p class="text-xs text-gray-500">${item.qty} x ${formatCurrency(item.price)}</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-bold text-sm text-indigo-700">${formatCurrency(itemTotal)}</span>
                <button class="text-red-400 hover:text-red-600"><i class="fas fa-times"></i></button>
            </div>
        `;
        const btn = div.querySelector('button');
        btn.addEventListener('click', () => removeFromCart(index));
        container.appendChild(div);
    });

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').innerText = formatCurrency(subtotal);
    document.getElementById('cart-tax').innerText = formatCurrency(tax);
    document.getElementById('cart-total').innerText = formatCurrency(total);
}

function processSale() {
    if(cart.length === 0) {
        showToast('Agrega productos al carrito primero', 'error');
        return;
    }

    const clientSelect = document.getElementById('pos-client-select');
    const clientId = clientSelect ? clientSelect.value : data.clients[0].id;
    const clientName = clientSelect ? clientSelect.options[clientSelect.selectedIndex].text : 'Cliente General';

    // Calc totals
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Create Sale Record
    const sale = {
        id: Date.now().toString().slice(-6), // Simple short ID
        date: new Date().toISOString(),
        clientId: clientId,
        clientName: clientName,
        items: cart.map(c => ({ ...c })), // shallow copy
        subtotal: subtotal,
        tax: tax,
        total: total
    };

    // Update Stock
    cart.forEach(cartItem => {
        const product = data.products.find(p => p.id === cartItem.id);
        if(product) {
            product.stock -= cartItem.qty;
            if(product.stock < 0) product.stock = 0;
        }
    });

    // Update Client Stats
    const client = data.clients.find(c => c.id == clientId);
    if(client) client.totalSpent = (client.totalSpent || 0) + total;

    data.sales.push(sale);
    saveData();
    
    // Show Invoice
    showInvoice(sale);
    
    // Reset Cart
    cart = [];
    updateCartUI();
    renderPosProducts(); // Refresh stock display
    showToast('¡Venta realizada con éxito!');
}

// --- INVOICE VIEW ---
function showInvoice(sale) {
    if(!sale) return;
    document.getElementById('inv-number').innerText = sale.id;
    document.getElementById('inv-date').innerText = new Date(sale.date).toLocaleDateString() + ' ' + new Date(sale.date).toLocaleTimeString();
    document.getElementById('inv-client').innerText = sale.clientName;
    
    const tbody = document.getElementById('inv-items');
    if(!tbody) return;
    tbody.innerHTML = '';
    sale.items.forEach(item => {
        tbody.innerHTML += `
            <tr class="border-b border-gray-100">
                <td class="text-left py-2 px-2">${item.name}</td>
                <td class="text-right py-2 px-2">${item.qty}</td>
                <td class="text-right py-2 px-2">${formatCurrency(item.price)}</td>
                <td class="text-right py-2 px-2 font-medium">${formatCurrency(item.price * item.qty)}</td>
            </tr>
        `;
    });

    document.getElementById('inv-subtotal').innerText = formatCurrency(sale.subtotal);
    document.getElementById('inv-tax').innerText = formatCurrency(sale.tax);
    document.getElementById('inv-total').innerText = formatCurrency(sale.total);

    openModal('invoice-modal');
}

// --- SALES / EXPENSES / CLIENTS RENDERERS ---
function renderSalesHistory() {
    const tbody = document.getElementById('sales-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    data.sales.slice().reverse().forEach(sale => {
        tbody.innerHTML += `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">#${sale.id}</td>
                <td class="px-6 py-4">${new Date(sale.date).toLocaleString()}</td>
                <td class="px-6 py-4">${sale.clientName}</td>
                <td class="px-6 py-4">${sale.items.length}</td>
                <td class="px-6 py-4 text-right font-bold">${formatCurrency(sale.total)}</td>
                <td class="px-6 py-4 text-center">
                    <button onclick='showInvoice(${JSON.stringify(sale)})' class="text-indigo-600 hover:text-indigo-800 mr-2"><i class="fas fa-eye"></i></button>
                    <button onclick="deleteSale('${sale.id}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function deleteSale(saleId) {
    showConfirmModal('¿Eliminar esta venta? Esto no ajustará el stock.', () => {
        data.sales = data.sales.filter(s => s.id !== saleId);
        saveData();
        renderSalesHistory();
        showToast('Venta eliminada', 'error');
    });
}

function renderExpenses() {
    const tbody = document.getElementById('expenses-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    data.expenses.slice().reverse().forEach(exp => {
        tbody.innerHTML += `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4">${exp.description}</td>
                <td class="px-6 py-4">${exp.category}</td>
                <td class="px-6 py-4">${formatDate(exp.date)}</td>
                <td class="px-6 py-4 text-right font-bold">${formatCurrency(exp.amount)}</td>
                <td class="px-6 py-4 text-center">
                    <button onclick="deleteExpense(${exp.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function saveExpense(e) {
    e.preventDefault();
    const desc = document.getElementById('exp-desc').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);
    const category = document.getElementById('exp-cat').value;
    const date = document.getElementById('exp-date').value;

    const newExp = {
        id: Date.now(),
        description: desc,
        amount,
        category,
        date
    };

    data.expenses.push(newExp);
    saveData();
    closeModal('expense-modal');
    const form = document.getElementById('expense-form');
    if(form) form.reset();
    renderExpenses();
    showToast('Gasto registrado correctamente');
}

function deleteExpense(id) {
    showConfirmModal('¿Eliminar este gasto?', () => {
        data.expenses = data.expenses.filter(e => e.id !== id);
        saveData();
        renderExpenses();
        showToast('Gasto eliminado', 'error');
    });
}

function renderClients() {
    const tbody = document.getElementById('clients-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    data.clients.forEach(c => {
        tbody.innerHTML += `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${c.name}</td>
                <td class="px-6 py-4">${c.email || '-'}</td>
                <td class="px-6 py-4">${c.phone || '-'}</td>
                <td class="px-6 py-4 text-right font-bold">${formatCurrency(c.totalSpent || 0)}</td>
                <td class="px-6 py-4 text-center">
                    <button onclick="deleteClient(${c.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function saveClient(e) {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;

    const newClient = {
        id: Date.now(),
        name, email, phone, totalSpent: 0
    };

    data.clients.push(newClient);
    saveData();
    closeModal('client-modal');
    const form = document.getElementById('client-form');
    if(form) form.reset();
    renderClients();
    showToast('Cliente agregado correctamente');
}

function deleteClient(id) {
    if(id == 1) {
        showToast('No se puede eliminar el Cliente General', 'error');
        return;
    }
    showConfirmModal('¿Eliminar este cliente?', () => {
        data.clients = data.clients.filter(c => c.id !== id);
        saveData();
        renderClients();
        showToast('Cliente eliminado', 'error');
    });
}

// Ensure initial renders for any visible sections when script loads
document.addEventListener('DOMContentLoaded', () => {
    // attach listeners if elements exist (some already attached above)
    const invSearch = document.getElementById('inventory-search');
    if(invSearch) invSearch.addEventListener('input', renderInventory);

    const posSearch = document.getElementById('pos-search');
    if(posSearch) posSearch.addEventListener('input', renderPosProducts);
});
