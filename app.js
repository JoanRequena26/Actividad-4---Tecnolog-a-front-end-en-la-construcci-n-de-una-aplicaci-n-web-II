// Frontend app.js adaptado para usar PymeAPI cuando esté disponible.
// Hace fallback a localStorage si no hay backend.

let data = {
    products: [],
    clients: [{id: 1, name: 'Cliente General', email: '', phone: '', totalSpent: 0}],
    sales: [],
    expenses: []
};

const TAX_RATE = 0.19;
const usingApi = !!window.PymeAPI;

window.onload = async function() {
    if (usingApi) {
        try {
            await loadDataFromApi();
            showToast('Conectado al backend', 'success');
        } catch (err) {
            console.error('Error cargando desde API:', err);
            showToast('No se pudo conectar al backend. Usando localStorage.', 'error');
            loadDataLocal();
        }
    } else {
        loadDataLocal();
    }
    updateDashboard();
    router('dashboard');
};

function saveDataLocal() {
    localStorage.setItem('pymeData', JSON.stringify(data));
    updateDashboard();
}

function loadDataLocal() {
    const stored = localStorage.getItem('pymeData');
    if (stored) {
        try {
            data = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing local data, seeding.');
            seedDataLocal();
        }
    } else {
        seedDataLocal();
    }
}

function seedDataLocal() {
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
    saveDataLocal();
}

async function loadDataFromApi() {
    // fetch and populate data
    const [products, clients, expenses, sales] = await Promise.all([
        window.PymeAPI.fetchProducts(),
        window.PymeAPI.fetchClients(),
        window.PymeAPI.fetchExpenses(),
        window.PymeAPI.fetchSales()
    ]);
    data.products = products || [];
    data.clients = clients || [{id:1, name:'Cliente General', email:'', phone:'', totalSpent:0}];
    // normalize client totalSpent key naming differences
    data.clients = data.clients.map(c => ({ id: c.id, name: c.name, email: c.email, phone: c.phone, totalSpent: c.total_spent || c.totalSpent || 0 }));
    data.expenses = expenses || [];
    data.sales = (sales || []).map(s => {
        // In API sale items have different shape: sale.items -> each item has product_id, name, price, qty
        const items = (s.items || []).map(it => ({ id: it.product_id, name: it.name, price: it.price, qty: it.qty }));
        return { id: s.id, date: s.date, clientId: s.client_id, clientName: s.client_name, items, subtotal: s.subtotal, tax: s.tax, total: s.total };
    });
}

// --- CONFIRMATION LOGIC ---
let pendingAction = null;

function showConfirmModal(message, action) {
    document.getElementById('confirm-message').innerText = message;
    pendingAction = action;
    document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    pendingAction = null;
}

function executeConfirmAction() {
    if (pendingAction) pendingAction();
    closeConfirmModal();
}

function resetData() {
    showConfirmModal('Se borrarán todos los datos y se recargará la página.', async () => {
        if (usingApi) {
            try {
                // call seed endpoint if available
                await fetch(`${window.__PYME_API_BASE__ || 'http://localhost:3000'}/seed`);
                showToast('DB reseed realizada en backend', 'success');
                await loadDataFromApi();
                updateDashboard();
                renderCurrentView();
            } catch (err) {
                console.error(err);
                showToast('No se pudo reseedear el backend', 'error');
            }
        } else {
            localStorage.removeItem('pymeData');
            location.reload();
        }
    });
}

// --- ROUTING / UI ---
function router(viewId) {
    document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
    const view = document.getElementById(`view-${viewId}`);
    if (view) view.classList.remove('hidden');

    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    const nav = document.getElementById(`nav-${viewId}`);
    if (nav) nav.classList.add('active');

    if(viewId === 'inventory') renderInventory();
    if(viewId === 'pos') initPOS();
    if(viewId === 'sales') renderSalesHistory();
    if(viewId === 'expenses') renderExpenses();
    if(viewId === 'clients') renderClients();
}

function renderCurrentView() {
    // detect visible view and re-render it
    if (!document.getElementById('view-dashboard').classList.contains('hidden')) updateDashboard();
    if (!document.getElementById('view-inventory').classList.contains('hidden')) renderInventory();
    if (!document.getElementById('view-pos').classList.contains('hidden')) initPOS();
    if (!document.getElementById('view-sales').classList.contains('hidden')) renderSalesHistory();
    if (!document.getElementById('view-expenses').classList.contains('hidden')) renderExpenses();
    if (!document.getElementById('view-clients').classList.contains('hidden')) renderClients();
}

// --- FORMATTERS ---
const formatCurrency = (num) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};
const formatDate = (dateString) => {
    if(!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-CO');
};

// --- TOAST ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    const colors = type === 'success' ? 'bg-emerald-500' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');
    toast.className = `${colors} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0 flex items-center gap-2`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle')}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full', 'opacity-0'), 10);
    setTimeout(() => { toast.classList.add('translate-x-full', 'opacity-0'); setTimeout(()=>toast.remove(), 300); }, 3000);
}

// --- MODALS ---
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// --- DASHBOARD ---
function updateDashboard() {
    const totalSales = data.sales.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const totalExpenses = data.expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    let grossProfit = 0;
    data.sales.forEach(sale => {
        (sale.items || []).forEach(item => {
            const product = data.products.find(p => p.id === item.id);
            const cost = product ? product.cost : (item.price * 0.5);
            grossProfit += (item.price - cost) * item.qty;
        });
    });

    const netProfit = grossProfit - totalExpenses;
    const lowStockCount = data.products.filter(p => p.stock < 10).length;

    const el = (id) => document.getElementById(id);
    if(el('dash-sales')) el('dash-sales').innerText = formatCurrency(totalSales);
    if(el('dash-expenses')) el('dash-expenses').innerText = formatCurrency(totalExpenses);
    if(el('dash-profit')) el('dash-profit').innerText = formatCurrency(netProfit);
    if(el('dash-low-stock')) el('dash-low-stock').innerText = lowStockCount;

    // Latest sales
    const tbody = document.getElementById('dash-latest-sales');
    if (tbody) {
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

    // Top products
    const productCount = {};
    data.sales.forEach(s => (s.items || []).forEach(i => { productCount[i.name] = (productCount[i.name] || 0) + i.qty; }));
    const topProducts = Object.entries(productCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const prodList = document.getElementById('dash-top-products');
    if(prodList) {
        prodList.innerHTML = '';
        topProducts.forEach(([name,count]) => {
            prodList.innerHTML += `
                <li class="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <span class="font-medium text-gray-700">${name}</span>
                    <span class="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs font-bold">${count} sold</span>
                </li>
            `;
        });
    }
}

// --- INVENTORY ---
function renderInventory() {
    const tbody = document.getElementById('inventory-table-body');
    const filter = (document.getElementById('inventory-search')?.value || '').toLowerCase();
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
                        <button onclick="onDeleteProduct(${p.id})" class="text-red-500 hover:text-red-700 ml-2"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }
    });
}
document.addEventListener('input', (e)=> {
    if (e.target && e.target.id === 'inventory-search') renderInventory();
});

async function saveProduct(e) {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const cat = document.getElementById('prod-cat').value;
    const stock = parseInt(document.getElementById('prod-stock').value);
    const price = parseFloat(document.getElementById('prod-price').value);
    const cost = parseFloat(document.getElementById('prod-cost').value);

    if (usingApi) {
        try {
            const created = await window.PymeAPI.createProduct({ name, category: cat, stock, price, cost });
            data.products.push(created);
            showToast('Producto agregado (backend)', 'success');
            renderInventory();
            updateDashboard();
            closeModal('product-modal');
            document.getElementById('product-form').reset();
        } catch (err) {
            console.error(err);
            showToast('Error creando producto en backend', 'error');
        }
    } else {
        const newProd = { id: Date.now(), name, category: cat, stock, price, cost };
        data.products.push(newProd);
        saveDataLocal();
        closeModal('product-modal');
        document.getElementById('product-form').reset();
        renderInventory();
        showToast('Producto agregado correctamente');
    }
}

function onDeleteProduct(id) {
    showConfirmModal('¿Estás seguro de eliminar este producto del inventario?', async () => {
        if (usingApi) {
            try {
                await window.PymeAPI.deleteProductApi(id);
                data.products = data.products.filter(p => p.id !== id);
                renderInventory();
                updateDashboard();
                showToast('Producto eliminado (backend)', 'success');
            } catch (err) {
                console.error(err);
                showToast('Error eliminando producto en backend', 'error');
            }
        } else {
            data.products = data.products.filter(p => p.id !== id);
            saveDataLocal();
            renderInventory();
            showToast('Producto eliminado', 'error');
        }
    });
}

// --- POS / CART ---
let cart = [];

function initPOS() {
    renderPosProducts();
    updateCartUI();
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
document.addEventListener('input', (e) => {
    if(e.target && e.target.id === 'pos-search') renderPosProducts();
});

function renderPosProducts() {
    const grid = document.getElementById('pos-products-grid');
    const search = (document.getElementById('pos-search')?.value || '').toLowerCase();
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
    const existing = cart.find(i => i.id === productId);
    if (existing) {
        if (existing.qty < product.stock) existing.qty++;
        else { showToast('No hay suficiente stock', 'error'); return; }
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, maxStock: product.stock });
    }
    updateCartUI();
}

function removeFromCart(index) { cart.splice(index,1); updateCartUI(); }

function updateCartUI() {
    const container = document.getElementById('pos-cart-items');
    if(!container) return;
    if(cart.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 mt-10"><i class="fas fa-shopping-basket text-4xl mb-2"></i><br>El carrito está vacío</div>';
        ['cart-subtotal','cart-tax','cart-total'].forEach(id=>document.getElementById(id).innerText='$0.00');
        return;
    }
    container.innerHTML = '';
    let subtotal = 0;
    cart.forEach((item, idx) => {
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
        div.querySelector('button').addEventListener('click', ()=> removeFromCart(idx));
        container.appendChild(div);
    });
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    document.getElementById('cart-subtotal').innerText = formatCurrency(subtotal);
    document.getElementById('cart-tax').innerText = formatCurrency(tax);
    document.getElementById('cart-total').innerText = formatCurrency(total);
}

async function processSale() {
    if(cart.length === 0) { showToast('Agrega productos al carrito primero', 'error'); return; }
    const clientSelect = document.getElementById('pos-client-select');
    const clientId = clientSelect ? clientSelect.value : data.clients[0].id;
    const clientName = clientSelect ? clientSelect.options[clientSelect.selectedIndex].text : 'Cliente General';
    const subtotal = cart.reduce((acc,i)=>acc + i.price * i.qty, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    if (usingApi) {
        try {
            const payload = { clientId: Number(clientId), clientName, items: cart.map(i=>({ id: i.id, name: i.name, price: i.price, qty: i.qty })), subtotal, tax, total };
            const createdSale = await window.PymeAPI.createSale(payload);
            // Normalize and push to data.sales
            const saleNormalized = { id: createdSale.id, date: createdSale.date, clientId: createdSale.client_id, clientName: createdSale.client_name, items: (createdSale.items || []).map(it=>({ id: it.product_id, name: it.name, price: it.price, qty: it.qty })), subtotal: createdSale.subtotal, tax: createdSale.tax, total: createdSale.total };
            data.sales.push(saleNormalized);
            // refresh products from backend to have accurate stock
            data.products = await window.PymeAPI.fetchProducts();
            // normalize products keys if needed
            showInvoice(saleNormalized);
            cart = [];
            updateCartUI();
            renderPosProducts();
            renderSalesHistory();
            updateDashboard();
            showToast('¡Venta realizada con éxito!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Error procesando la venta en backend', 'error');
        }
    } else {
        const sale = { id: Date.now().toString().slice(-6), date: new Date().toISOString(), clientId, clientName, items: [...cart], subtotal, tax, total };
        // update stock locally
        cart.forEach(ci => {
            const prod = data.products.find(p=>p.id===ci.id);
            if(prod) prod.stock -= ci.qty;
        });
        data.sales.push(sale);
        saveDataLocal();
        showInvoice(sale);
        cart = [];
        updateCartUI();
        renderPosProducts();
        showToast('¡Venta realizada con éxito!');
    }
}

// --- INVOICE ---
function showInvoice(sale) {
    if(!sale) return;
    document.getElementById('inv-number').innerText = sale.id;
    document.getElementById('inv-date').innerText = new Date(sale.date).toLocaleDateString() + ' ' + new Date(sale.date).toLocaleTimeString();
    document.getElementById('inv-client').innerText = sale.clientName;
    const tbody = document.getElementById('inv-items');
    if(!tbody) return;
    tbody.innerHTML = '';
    (sale.items || []).forEach(item => {
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

// --- SALES HISTORY / EXPENSES / CLIENTS ---
async function renderSalesHistory() {
    const tbody = document.getElementById('sales-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    (data.sales || []).slice().reverse().forEach(sale => {
        tbody.innerHTML += `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">#${sale.id}</td>
                <td class="px-6 py-4">${new Date(sale.date).toLocaleString()}</td>
                <td class="px-6 py-4">${sale.clientName}</td>
                <td class="px-6 py-4">${(sale.items||[]).length}</td>
                <td class="px-6 py-4 text-right font-bold">${formatCurrency(sale.total)}</td>
                <td class="px-6 py-4 text-center">
                    <button onclick='showInvoice(${JSON.stringify(sale)})' class="text-indigo-600 hover:text-indigo-800 mr-2"><i class="fas fa-eye"></i></button>
                    <button onclick="onDeleteSale('${sale.id}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function onDeleteSale(saleId) {
    showConfirmModal('¿Eliminar esta venta? Esto ajustará stock y total del cliente si está en backend.', async () => {
        if (usingApi) {
            try {
                await window.PymeAPI.deleteSaleApi(saleId);
                // refresh all data
                await loadDataFromApi();
                renderSalesHistory();
                renderInventory();
                updateDashboard();
                showToast('Venta eliminada (backend)', 'success');
            } catch (err) {
                console.error(err);
                showToast('Error eliminando venta en backend', 'error');
            }
        } else {
            data.sales = data.sales.filter(s=>s.id!==saleId);
            saveDataLocal();
            renderSalesHistory();
            updateDashboard();
            showToast('Venta eliminada', 'error');
        }
    });
}

async function renderExpenses() {
    if (usingApi) {
        try {
            data.expenses = await window.PymeAPI.fetchExpenses();
        } catch(e) { console.error(e); showToast('Error obteniendo gastos', 'error'); }
    }
    const tbody = document.getElementById('expenses-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    (data.expenses || []).slice().reverse().forEach(exp => {
        tbody.innerHTML += `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4">${exp.description}</td>
                <td class="px-6 py-4">${exp.category}</td>
                <td class="px-6 py-4">${formatDate(exp.date)}</td>
                <td class="px-6 py-4 text-right font-bold">${formatCurrency(exp.amount)}</td>
                <td class="px-6 py-4 text-center">
                    <button onclick="onDeleteExpense(${exp.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

async function saveExpense(e) {
    e.preventDefault();
    const desc = document.getElementById('exp-desc').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);
    const category = document.getElementById('exp-cat').value;
    const date = document.getElementById('exp-date').value;

    if (usingApi) {
        try {
            const created = await window.PymeAPI.createExpense({ description: desc, amount, category, date });
            data.expenses.push(created);
            closeModal('expense-modal');
            showToast('Gasto registrado (backend)', 'success');
            renderExpenses();
            updateDashboard();
        } catch (err) {
            console.error(err);
            showToast('Error registrando gasto en backend', 'error');
        }
    } else {
        const newExp = { id: Date.now(), description: desc, amount, category, date };
        data.expenses.push(newExp);
        saveDataLocal();
        closeModal('expense-modal');
        showToast('Gasto registrado correctamente');
        renderExpenses();
    }
}

function onDeleteExpense(id) {
    showConfirmModal('¿Eliminar este gasto?', async () => {
        if (usingApi) {
            try {
                await window.PymeAPI.deleteExpenseApi(id);
                data.expenses = data.expenses.filter(e=>e.id!==id);
                renderExpenses();
                updateDashboard();
                showToast('Gasto eliminado (backend)', 'success');
            } catch (err) {
                console.error(err);
                showToast('Error eliminando gasto', 'error');
            }
        } else {
            data.expenses = data.expenses.filter(e=>e.id!==id);
            saveDataLocal();
            renderExpenses();
            showToast('Gasto eliminado', 'error');
        }
    });
}

async function renderClients() {
    if (usingApi) {
        try {
            const clients = await window.PymeAPI.fetchClients();
            data.clients = clients.map(c => ({ id: c.id, name: c.name, email: c.email, phone: c.phone, totalSpent: c.total_spent || 0 }));
        } catch (e) { console.error(e); showToast('Error cargando clientes', 'error'); }
    }
    const tbody = document.getElementById('clients-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    (data.clients || []).forEach(c => {
        tbody.innerHTML += `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${c.name}</td>
                <td class="px-6 py-4">${c.email || '-'}</td>
                <td class="px-6 py-4">${c.phone || '-'}</td>
                <td class="px-6 py-4 text-right font-bold">${formatCurrency(c.totalSpent || 0)}</td>
                <td class="px-6 py-4 text-center">
                    <button onclick="onDeleteClient(${c.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

async function saveClient(e) {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;

    if (usingApi) {
        try {
            const created = await window.PymeAPI.createClient({ name, email, phone });
            data.clients.push({ id: created.id, name: created.name, email: created.email, phone: created.phone, totalSpent: created.total_spent || 0 });
            closeModal('client-modal');
            renderClients();
            showToast('Cliente agregado (backend)', 'success');
        } catch (err) {
            console.error(err);
            showToast('Error creando cliente', 'error');
        }
    } else {
        const newClient = { id: Date.now(), name, email, phone, totalSpent: 0 };
        data.clients.push(newClient);
        saveDataLocal();
        closeModal('client-modal');
        renderClients();
        showToast('Cliente agregado correctamente');
    }
}

function onDeleteClient(id) {
    if (id == 1) { showToast('No se puede eliminar el Cliente General', 'error'); return; }
    showConfirmModal('¿Eliminar este cliente?', async () => {
        if (usingApi) {
            try {
                await window.PymeAPI.deleteClientApi(id);
                data.clients = data.clients.filter(c=>c.id!==id);
                renderClients();
                showToast('Cliente eliminado (backend)', 'success');
            } catch (err) {
                console.error(err);
                showToast('Error eliminando cliente', 'error');
            }
        } else {
            data.clients = data.clients.filter(c=>c.id!==id);
            saveDataLocal();
            renderClients();
            showToast('Cliente eliminado', 'error');
        }
    });
}

// Ensure initial event attachments
document.addEventListener('DOMContentLoaded', () => {
    const invSearch = document.getElementById('inventory-search');
    if(invSearch) invSearch.addEventListener('input', renderInventory);
    const posSearch = document.getElementById('pos-search');
    if(posSearch) posSearch.addEventListener('input', renderPosProducts);
});
